from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from unittest.mock import patch

from .models import Payment, Product


class HealthCheckTests(TestCase):
    def test_health_endpoint(self) -> None:
        client = Client()
        response = client.get("/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["service"], "store")


class ProductApiContractTests(TestCase):
    def test_products_endpoint_returns_catalog_fields(self) -> None:
        Product.objects.create(
            name="Bronze Pendant",
            description="Replica",
            price="25.00",
            stock=10,
            image="https://example.com/bronze.jpg",
            category="jewelry",
        )

        client = Client()
        response = client.get("/api/products/")
        self.assertEqual(response.status_code, 200)

        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["name"], "Bronze Pendant")
        self.assertEqual(payload[0]["category"], "jewelry")
        self.assertEqual(payload[0]["image"], "https://example.com/bronze.jpg")


class PaymentValidationTests(TestCase):
    def setUp(self) -> None:
        self.product = Product.objects.create(
            name="Test Product",
            description="Test",
            price="10.00",
            stock=5,
        )

    def test_payment_rejects_unsupported_chain(self) -> None:
        client = Client()
        response = client.post(
            "/payments/process/",
            data={
                "chain": "bitcoin",
                "wallet": "abc",
                "amount": 1,
                "product_id": self.product.id},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_solana_requires_signature_proof(self) -> None:
        client = Client()
        response = client.post(
            "/payments/process/",
            data={
                "chain": "solana",
                "wallet": "abc",
                "amount": 1,
                "product_id": self.product.id,
                "proof": {},
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_ton_requires_tx_hash_proof(self) -> None:
        client = Client()
        response = client.post(
            "/payments/process/",
            data={
                "chain": "ton",
                "wallet": "abc",
                "amount": 1,
                "product_id": self.product.id,
                "proof": {}},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)


class AdminApiTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.user_model = get_user_model()
        self.admin = self.user_model.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="strong-pass-123",
        )

    def _admin_headers(self) -> dict[str, str]:
        token_response = self.client.post(
            "/api/admin/auth/token/",
            data={"username": "admin", "password": "strong-pass-123"},
            content_type="application/json",
        )
        self.assertEqual(token_response.status_code, 200)
        access = token_response.json()["access"]
        return {"HTTP_AUTHORIZATION": f"Bearer {access}"}

    def test_admin_products_requires_authentication(self) -> None:
        response = self.client.get("/api/admin/products/")
        self.assertEqual(response.status_code, 401)

    def test_admin_can_create_and_update_product(self) -> None:
        headers = self._admin_headers()

        create_response = self.client.post(
            "/api/admin/products/",
            data={
                "name": "Palm Oil",
                "description": "Freshly sourced",
                "price": "23.50",
                "stock": 22,
                "image": "https://example.com/palm-oil.jpg",
                "category": "food",
            },
            content_type="application/json",
            **headers,
        )
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(create_response.json()["category"], "food")
        product_id = create_response.json()["id"]

        patch_response = self.client.patch(
            f"/api/admin/products/{product_id}/",
            data={"stock": 18},
            content_type="application/json",
            **headers,
        )
        self.assertEqual(patch_response.status_code, 200)
        self.assertEqual(patch_response.json()["stock"], 18)

    def test_admin_rejects_invalid_category(self) -> None:
        headers = self._admin_headers()
        response = self.client.post(
            "/api/admin/products/",
            data={
                "name": "Invalid Category Product",
                "description": "Bad category",
                "price": "10.00",
                "stock": 1,
                "category": "invalid",
            },
            content_type="application/json",
            **headers,
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("category", response.json())

    def test_admin_can_view_payment_logs(self) -> None:
        headers = self._admin_headers()
        product = Product.objects.create(
            name="Shea Butter",
            description="Raw",
            price="12.00",
            stock=8)
        Payment.objects.create(
            product=product,
            tx_hash="abc123",
            blockchain="TON",
            status="confirmed")

        response = self.client.get("/api/admin/payments/", **headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)


class DedicatedPaymentEndpointTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.product = Product.objects.create(
            name="Cocoa",
            description="Premium",
            price="9.50",
            stock=12,
        )

    @patch("core.views.verify_ton_transaction", return_value=True)
    def test_pay_ton_confirms_payment_when_verified(
            self, _mock_verify) -> None:
        response = self.client.post(
            "/payments/ton/",
            data={"productId": self.product.id, "txHash": "ton-tx-001"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "confirmed")
        self.assertTrue(
            Payment.objects.filter(
                tx_hash="ton-tx-001",
                blockchain="TON").exists())

    @patch("core.views.verify_solana_transaction", return_value=False)
    def test_pay_solana_sets_pending_when_not_verified(
            self, _mock_verify) -> None:
        response = self.client.post(
            "/payments/solana/",
            data={"productId": self.product.id, "txHash": "solana-tx-001"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "pending")
        self.assertTrue(
            Payment.objects.filter(
                tx_hash="solana-tx-001",
                blockchain="Solana").exists())


class IdiaEndpointTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()

    @patch("core.views.idia_service")
    def test_token_info_returns_service_payload(
            self, mock_idia_service) -> None:
        mock_idia_service.get_token_info.return_value = {
            "result": [{"balance": "1000", "code_hash": "abc"}]}

        response = self.client.get("/api/idia/token-info/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("result", response.json())

    @patch("core.views.wallet_service")
    def test_idia_balance_returns_balance(self, mock_wallet_service) -> None:
        mock_wallet_service.get_balance.return_value = 12345

        response = self.client.get("/api/idia/balance/wallet123/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["balance"], 12345)

    @patch("core.views.wallet_service")
    def test_transfer_idia_returns_transfer_message(
            self, mock_wallet_service) -> None:
        mock_wallet_service.build_transfer_message.return_value = {
            "op": "0xf8a7ea5",
            "amount": 200,
            "destination": "wallet_dest",
            "forward_ton": 10000000,
        }

        response = self.client.post(
            "/api/idia/transfer/",
            data={"to_address": "wallet_dest", "amount": 200},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("transfer_message", response.json())
