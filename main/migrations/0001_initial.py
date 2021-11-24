# Generated by Django 3.2.9 on 2021-11-24 19:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.expressions
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=128, verbose_name='AdminUsername')),
                ('password_md5', models.CharField(max_length=32, verbose_name='AdminPasswordMD5')),
            ],
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('url', models.CharField(blank=True, max_length=150, null=True)),
                ('host', models.URLField(blank=True, null=True)),
                ('displayName', models.CharField(max_length=100, unique=True)),
                ('github', models.URLField(default='')),
                ('profilePic', models.ImageField(blank=True, upload_to='profilePics/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('commentId', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('publishedOn', models.DateTimeField(auto_now_add=True)),
                ('contentType', models.CharField(choices=[('text/markdown', 'Common Mark'), ('text/plain', 'Utf-8'), ('application/base64', 'applcation/base64'), ('image/png;base64', 'PNG'), ('image/jpeg;base64', 'JPEG')], default='text/plain', max_length=20)),
                ('text', models.TextField(default='', max_length=500)),
                ('authorId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.author')),
            ],
        ),
        migrations.CreateModel(
            name='Inbox',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('nodeId', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('host', models.CharField(max_length=512, verbose_name='Host URL')),
                ('create_time', models.FloatField(verbose_name='Node create timestamp')),
                ('node_type', models.CharField(choices=[('SHARE', 'Share'), ('FETCH', 'Fetch')], max_length=5, verbose_name='Node Type')),
                ('if_approved', models.BooleanField(default=True, verbose_name='If approved to connect')),
                ('password_md5', models.CharField(max_length=32, verbose_name='Auth Password')),
                ('http_username', models.CharField(blank=True, default='', max_length=512, null=True, verbose_name='Http Auth Username(FETCH)')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('postId', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(default='', max_length=100)),
                ('source', models.URLField(blank=True, null=True)),
                ('origin', models.URLField(blank=True, null=True)),
                ('description', models.TextField(default='')),
                ('content', models.TextField(default='')),
                ('contentType', models.CharField(choices=[('text/markdown', 'Common Mark'), ('text/plain', 'Utf-8'), ('application/base64', 'application/base64'), ('image/png;base64', 'PNG'), ('image/jpeg;base64', 'JPEG')], default='text/plain', max_length=20)),
                ('categories', models.TextField(default='')),
                ('commentCount', models.IntegerField(default=0)),
                ('likeCount', models.IntegerField(default=0)),
                ('commentUrl', models.TextField(default=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False))),
                ('publishedOn', models.DateTimeField(auto_now_add=True)),
                ('visibility', models.CharField(choices=[('public', 'PUBLIC'), ('friends', 'FRIENDS ONLY'), ('fof', 'FRIENDS OF FRIENDS'), ('toAuthor', 'AUTHOR ONLY')], default='public', max_length=20)),
                ('unlisted', models.BooleanField(default=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_set', to='main.author')),
            ],
        ),
        migrations.CreateModel(
            name='LikePost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('authorId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.author')),
                ('postId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.post')),
            ],
        ),
        migrations.CreateModel(
            name='LikeComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('commentId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.comment')),
                ('liker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.author')),
            ],
        ),
        migrations.CreateModel(
            name='Following',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followee', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='follower_set', to='main.author')),
                ('follower', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='followed_set', to='main.author')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='postId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.post'),
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('reqId', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('Accept', 'Accept'), ('Decline', 'Decline'), ('Pending', 'Pending')], default='Pending', max_length=50)),
                ('author', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='to_user', to='main.author')),
                ('friend', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='from_user', to='main.author')),
            ],
            options={
                'unique_together': {('author', 'friend')},
            },
        ),
        migrations.AddConstraint(
            model_name='following',
            constraint=models.CheckConstraint(check=models.Q(('follower', django.db.models.expressions.F('followee')), _negated=True), name='follower_ne_followee'),
        ),
        migrations.AlterUniqueTogether(
            name='following',
            unique_together={('follower', 'followee')},
        ),
    ]
