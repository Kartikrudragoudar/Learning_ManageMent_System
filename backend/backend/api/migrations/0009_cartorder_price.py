# Generated by Django 5.2.1 on 2025-06-25 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_cartorderitem_coupons_cartorderitem_coupons'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartorder',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
        ),
    ]
