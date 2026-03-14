import base64
from typing import Any


class JettonWalletService:
    def __init__(self, client: Any):
        self.client = client

    def get_balance(self, wallet_address: str):
        result = self.client.net.query_collection(
            collection="accounts",
            filter={"id": {"eq": wallet_address}},
            result="balance",
        )

        rows = result.get("result", [])
        if not rows:
            return 0
        return int(rows[0].get("balance", 0))

    def build_transfer_message(
        self,
        destination: str,
        amount: int,
        forward_ton: int = 10000000,
        response_address: str | None = None,
        query_id: int = 0,
    ):
        if amount < 0:
            raise ValueError("amount must be non-negative")
        if forward_ton < 0:
            raise ValueError("forward_ton must be non-negative")

        try:
            from tonsdk.boc import Cell
            from tonsdk.utils import Address
        except Exception as exc:
            raise RuntimeError(
                "tonsdk is required to build a Jetton transfer BOC payload"
            ) from exc

        response = response_address or destination

        body = Cell()
        body.bits.write_uint(0x0F8A7EA5, 32)
        body.bits.write_uint(query_id, 64)
        body.bits.write_grams(amount)
        body.bits.write_address(Address(destination))
        body.bits.write_address(Address(response))
        body.bits.write_bit(0)
        body.bits.write_grams(forward_ton)
        body.bits.write_bit(0)

        boc = base64.b64encode(body.to_boc(False)).decode("utf-8")
        return {
            "op": "0xf8a7ea5",
            "amount": amount,
            "destination": destination,
            "response_address": response,
            "forward_ton": forward_ton,
            "query_id": query_id,
            "boc_base64": boc,
        }
