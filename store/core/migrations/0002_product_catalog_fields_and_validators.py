from django.core.validators import MinValueValidator
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="price",
            field=models.DecimalField(
                decimal_places=2, max_digits=10, validators=[
                    MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name="product",
            name="stock",
            field=models.IntegerField(
                default=0, validators=[
                    MinValueValidator(0)]),
        ),
        migrations.AddField(
            model_name="product",
            name="category",
            field=models.CharField(
                blank=True,
                choices=[
                    ("jewelry", "Jewelry"),
                    ("fashion", "Fashion"),
                    ("art", "Art"),
                    ("craft", "Craft"),
                    ("food", "Food"),
                ],
                default="",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="image",
            field=models.URLField(blank=True, default="", max_length=500),
        ),
    ]
