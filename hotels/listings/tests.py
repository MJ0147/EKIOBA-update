from django.test import Client, TestCase


class HealthCheckTests(TestCase):
    def test_health_endpoint(self) -> None:
        client = Client()
        response = client.get("/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["service"], "hotels")
