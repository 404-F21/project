from django.db import models
import uuid
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class Author(models.Model):

    '''
    Login information
    '''
    password = models.CharField(max_length=25, default = "", blank=True)
    '''
    Public information
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False, blank=False)

    url = models.CharField(max_length=150, blank=True, null=True)

    host = models.URLField(blank=True, null=True)
    displayName = models.CharField(max_length=100, unique=True)

    github = models.URLField(default="")

class Post(models.Model):
    contentOptions = (
        ("text/markdown", "Common Mark"),
        ("text/plain", "Utf-8"),
        ("application/base64", "applcation/base64"),
        ("image/png;base64", "PNG"),
        ("image/jpeg;base64", "JPEG")
    )

    visibilityOptions = (
        ("public", "PUBLIC"),
        ("friends", "FRIENDS ONLY"),
        ("fof", "FRIENDS OF FRIENDS")
    )

    postId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    authorId = models.ForeignKey(Author, on_delete=models.CASCADE)

    title = models.CharField(max_length=100, default="")
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(null=True, blank=True)
    #description = models.TextField(default="")
    post_text = models.TextField(default="")
    #contentType = models.CharField(max_length=20, choices=contentOptions, default="text/plain")
    contentType = models.CharField(max_length=20, default="text/plain")
    categories = models.TextField(default="")
    commentCount = models.IntegerField(default=0)
    likeCount = models.IntegerField(default=0)

    # URL of the comment
    # i.e. posturl/comments
    commentUrl = models.TextField(default=postId)

    #commentSrc = models.ForeignKey(commentSrc, on_delete=models.CASCADE)
    publishedOn = models.DateTimeField(default=timezone.now)

    #visibility = models.CharField(max_length=20, choices=visibilityOptions)
    visibility = models.CharField(max_length=20, default="PUBLIC")
    unlisted = models.BooleanField(default=False)

    def __str__(self):
        return str(self.postId)

class Comment(models.Model):

    commentId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    postId = models.ForeignKey(Post, on_delete=CASCADE)
    authorId = models.ForeignKey(Author, on_delete=CASCADE)
    publishedOn = models.DateTimeField(default=timezone.now)
    text = models.TextField(default="", max_length=500)

class LikePost(models.Model):
    postId = models.ForeignKey(Post, on_delete=CASCADE)
    authorId = models.ForeignKey(Author, on_delete=CASCADE)

class Test(models.Model):
    id = models.UUIDField(primary_key=True, default = uuid.uuid4, editable=False)

