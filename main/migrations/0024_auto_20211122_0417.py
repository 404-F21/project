# Generated by Django 3.2.9 on 2021-11-22 04:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0023_auto_20211112_0446'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='profileImage',
            new_name='profilePic',
        ),
        migrations.RenameField(
            model_name='author',
            old_name='id',
            new_name='uid',
        ),
        migrations.RemoveField(
            model_name='author',
            name='last_login',
        ),
        migrations.RemoveField(
            model_name='author',
            name='password',
        ),
        migrations.AddField(
            model_name='author',
            name='user',
            field=models.ForeignKey(default=123456, on_delete=django.db.models.deletion.CASCADE, to='auth.user'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='author',
            name='displayName',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.DeleteModel(
            name='Admin',
        ),
    ]
