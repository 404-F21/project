# Generated by Django 3.2.9 on 2021-11-22 05:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0024_auto_20211122_0417'),
    ]

    operations = [
        migrations.AlterField(
            model_name='following',
            name='followee',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='follower_set', to='main.author'),
        ),
        migrations.AlterField(
            model_name='following',
            name='follower',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='followed_set', to='main.author'),
        ),
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_set', to='main.author'),
        ),
    ]
