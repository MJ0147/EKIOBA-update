from django.db import models
from django.core.validators import MinValueValidator


class Product(models.Model):
    class Category(models.TextChoices):
        JEWELRY = "jewelry", "Jewelry"
        FASHION = "fashion", "Fashion"
        ART = "art", "Art"
        CRAFT = "craft", "Craft"
        FOOD = "food", "Food"

    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)])
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image = models.URLField(max_length=500, blank=True, default="")
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        blank=True,
        default="")

    def __str__(self) -> str:
        return self.name


class Payment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    tx_hash = models.CharField(max_length=100)
    blockchain = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.blockchain}:{self.tx_hash}:{self.status}"
