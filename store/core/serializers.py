from decimal import Decimal

from rest_framework import serializers

from .models import Payment, Product


class ProductSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal("0.00"))
    stock = serializers.IntegerField(min_value=0)
    image = serializers.URLField(
        required=False,
        allow_blank=True,
        max_length=500)
    category = serializers.ChoiceField(
        choices=Product.Category.choices,
        required=False,
        allow_blank=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "stock",
            "image",
            "category"]


class PaymentSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "product",
            "product_name",
            "tx_hash",
            "blockchain",
            "status",
            "created_at",
        ]
