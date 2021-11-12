# Generated by Django 3.2.9 on 2021-11-07 06:44

import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_auto_20211107_0642'),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('author_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='main.author')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            bases=('main.author',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]