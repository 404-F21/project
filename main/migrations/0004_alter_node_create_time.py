# Generated by Django 3.2.9 on 2021-11-26 04:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20211125_1155'),
    ]

    operations = [
        migrations.AlterField(
            model_name='node',
            name='create_time',
            field=models.FloatField(default=1637901135.687646, verbose_name='Node create timestamp'),
        ),
    ]
