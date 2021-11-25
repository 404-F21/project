import time

from django.db import models
import uuid
# from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
# from django.contrib.auth import authenticate
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


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

    # user = models.ForeignKey(User, on_delete=models.CASCADE)

    host = models.URLField(blank=True, null=True)
    displayName = models.CharField(max_length=100, unique=True)

    # Potentially the future home of the HATEOS URL for github API
    github = models.URLField(default="")

    profilePic = models.ImageField(upload_to='profilePics/', blank=True)

    def __str__(self):
        return str(self.id) + ": " + str(self.displayName)


class FriendRequest(models.Model):
    # https://medium.com/analytics-vidhya/add-friends-with-689a2fa4e41d

    option = (
        ('Accept', 'Accept'),
        ('Decline', 'Decline'),
        ('Pending', 'Pending'),
    )

    reqId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    friend = models.ForeignKey(Author, related_name='from_user',on_delete=models.CASCADE, editable=False)
    author = models.ForeignKey(Author,  related_name='to_user',on_delete=models.CASCADE, editable=False)
    status = models.CharField(max_length=50, choices=option, default='Pending')

    class Meta:
        unique_together = ('author', 'friend',)

    def __str__(self):
        return str(self.friend.displayName) + " wants to follow " + str(self.author.displayName)

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
        ("fof", "FRIENDS OF FRIENDS"),
        ("toAuthor", "AUTHOR ONLY"), # not sure how to implement this
    )

    postId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    authorId = models.ForeignKey(Author, on_delete=models.CASCADE)

    title = models.CharField(max_length=100, default="")
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(null=True, blank=True)
    description = models.TextField(default="")
    post_text = models.TextField(default="")
    # contentType = models.CharField(max_length=20, default="text/plain")
    contentType = models.CharField(max_length=20, choices=contentOptions, default="text/plain")
    categories = models.TextField(default="")
    commentCount = models.IntegerField(default=0)
    likeCount = models.IntegerField(default=0)

    # URL of the comment
    # i.e. posturl/comments
    commentUrl = models.TextField(default=postId)

    #commentSrc = models.ForeignKey(commentSrc, on_delete=models.CASCADE)
    publishedOn = models.DateTimeField(auto_now_add=True, blank=True)

    #visibility = models.CharField(max_length=20, choices=visibilityOptions)
    visibility = models.CharField(max_length=20, choices=visibilityOptions, default="PUBLIC")
    unlisted = models.BooleanField(default=False)

#     def __str__(self):
#         return str(self.postId)

class Comment(models.Model):
    contentOptions = (
        ("text/markdown", "Common Mark"),
        ("text/plain", "Utf-8"),
        ("application/base64", "applcation/base64"),
        ("image/png;base64", "PNG"),
        ("image/jpeg;base64", "JPEG")
    )

    commentId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    postId = models.ForeignKey(Post, on_delete=models.CASCADE)
    authorId = models.ForeignKey(Author, on_delete=models.CASCADE)
    publishedOn = models.DateTimeField(auto_now_add=True, blank=True)
    contentType = models.CharField(max_length=20, choices=contentOptions, default="text/plain")
    text = models.TextField(default="", max_length=500)

    def __str__(self):
        return str(self.commentId)

class LikePost(models.Model):
    postId = models.ForeignKey(Post, on_delete=models.CASCADE)
    authorId = models.ForeignKey(Author, on_delete=models.CASCADE)

    # TODO
    # Get the id of the author of the post and send an inbox notification

    def __str__(self):
        # return self.liker.displayName + " liked your post"
        pass

# https://djangocentral.com/creating-comments-system-with-django/
class LikeComment(models.Model):
    commentId = models.ForeignKey(Comment, on_delete=models.CASCADE)
    liker = models.ForeignKey(Author, on_delete=models.CASCADE)

    # TODO
    # Get the id of the author of the post and send an inbox notification

    def __str__(self):
        return self.liker.displayName + " liked your comment"

class Like(models.Model):
    # TODO
    # get the id of the author from the url

    # return LikePost objects and LikeComment objects
    # not sure if we need this as a class even
    pass

class Inbox(models.Model):
    # TODO
    # get the id of the author from the url

    # return posts for which the current user is the author
    pass


class Admin(models.Model):
    """
    Model for server admin
    """
    username = models.CharField(max_length=128, blank=False, null=False, verbose_name='Admin Username')

    password_md5 = models.CharField(max_length=32, blank=False, null=False, verbose_name='Admin Password MD5')

    def __str__(self):
        return str(self.id) + ': ' + self.username

    def dict(self):
        return {
            'id': self.id,
            'username': self.username
        }


class Node(models.Model):
    """
    Nodes
    """
    # Nodes share their data with us
    TYPE_FETCH = 'FETCH'
    # Nodes fetch data from us
    TYPE_SHARE = 'SHARE'
    TYPE_CHOICE = [
        (TYPE_SHARE, 'Share'),
        (TYPE_FETCH, 'Fetch')
    ]

    nodeId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    host = models.CharField(max_length=512, blank=False, null=False, verbose_name='Host URL')

    create_time = models.FloatField(blank=False, null=False, default=time.time(), verbose_name='Node create timestamp')

    node_type = models.CharField(max_length=5, blank=False, null=False, choices=TYPE_CHOICE, verbose_name='Node Type')

    if_approved = models.BooleanField(blank=False, null=False, default=True, verbose_name='If approved to connect')

    password_md5 = models.CharField(max_length=32, blank=False, null=False, verbose_name='Auth Password')

    http_username = \
        models.CharField(max_length=512, blank=True, null=True, default='', verbose_name='Http Auth Username(FETCH)')

    def dict(self):
        return {
            'id': str(self.nodeId),
            'host': self.host,
            'createTime': self.create_time,
            'nodeType': self.node_type,
            'ifApproved': self.if_approved
        }
