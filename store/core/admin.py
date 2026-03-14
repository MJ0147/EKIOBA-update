from django.contrib import admin
from .models import Product, Payment


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("product", "blockchain", "tx_hash", "status", "created_at")
