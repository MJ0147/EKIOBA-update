from django.db import models


class Listing(models.Model):
    title = models.CharField(max_length=160)
    city = models.CharField(max_length=100)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return self.title
