# Generated by Django 3.2.8 on 2021-10-26 20:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20211026_1958'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='likeCount',
            field=models.IntegerField(default=0),
        ),
        migrations.CreateModel(
            name='LikePost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('authorId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.author')),
                ('postId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.post')),
            ],
        ),
    ]
