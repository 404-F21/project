# Copyright 2021 Kanishk Chawla, Nathan Drapeza, Warren Stix

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import time
import os
from django.db import models
import uuid
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser
from social.settings import deploy_host, BASE_DIR
from django.utils.translation import gettext_lazy as _


# from django.contrib.auth import authenticate

class Author(models.Model):
    # Author Info

    '''
    Private information
    '''
    password = models.CharField(max_length=25, default = "", blank=True)

    # will always be appended to the author's URL
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, blank=False)
    url = models.CharField(max_length=150, blank=True, null=True)

    # User in the default django table
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    host = models.URLField(blank=True, null=True)  # Url of different hosts
    displayName = models.CharField(max_length=100, unique=True)

    # HATEOS url for GITHUB API???
    github = models.URLField(default="")

    profilePic = models.CharField(max_length=512, blank=True)

    # If the author is from goreign node
    if_foreign = models.BooleanField(null=False, default=False)

    def save(self, *args, **kwargs):
        if self.url is None:
            self.url = f'{self.host}service/author/{self.id}'

        super(Author, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id) + ": " + self.displayName


    # for the record, these dict() methods should not exist, and we should be
    #  using serializers. they are much faster and safer.
    def dict(self):
        return {
            'id': str(self.id),
            'url': self.url,
            'host': self.host,
            'displayName': self.displayName,
            'github': self.github,
            'profilePic': self.profilePic
        }


class FriendRequest(models.Model):
    # https://medium.com/analytics-vidhya/add-friends-with-689a2fa4e41d

    option = (
        ('Accept', 'Accept'),
        ('Decline', 'Decline'),
        ('Pending', 'Pending'),
    )

    reqId = models.UUIDField(primary_key=True,
                             default=uuid.uuid4,
                             editable=False)
    friend = models.ForeignKey(Author,
                               related_name='from_user',
                               on_delete=models.CASCADE,
                               editable=False)
    author = models.ForeignKey(Author,
                               related_name='to_user',
                               on_delete=models.CASCADE,
                               editable=False)
    status = models.CharField(max_length=50,
                              choices=option,
                              default='Pending')

    class Meta:
        unique_together = ('author', 'friend',)

    def __str__(self):
        return (str(self.friend.displayName) +
                " wants to follow " +
                str(self.author.displayName))


class Following(models.Model):
    follower = models.ForeignKey(Author,
                                 related_name='followed_set',
                                 on_delete=models.CASCADE,
                                 editable=False)
    followee = models.ForeignKey(Author,
                                 related_name='follower_set',
                                 on_delete=models.CASCADE,
                                 editable=False)

    class Meta:
        unique_together = ('follower', 'followee')
        constraints = [models.CheckConstraint(
            name='follower_ne_followee',
            check=~models.Q(follower=models.F('followee')),
        )]


class Post(models.Model):
    contentOptions = (
        ("text/markdown", "Common Mark"),
        ("text/plain", "Utf-8"),
        ("application/base64", "application/base64"),
        ("image/png;base64", "PNG"),
        ("image/jpeg;base64", "JPEG")
    )

    visibilityOptions = (
        ("public", "PUBLIC"),
        ("friends", "FRIENDS ONLY"),
        ("toAuthor", "AUTHOR ONLY"),
    )

    postId = models.UUIDField(primary_key=True,
                              default=uuid.uuid4,
                              editable=False)
    author = models.ForeignKey(Author,
                               related_name='post_set',
                               on_delete=models.CASCADE)
    # Used to store id of post from other nodes, to avoid repeat of fetch
    remoteId = models.CharField(max_length=512, blank=True, null=True, default='')

    title = models.CharField(max_length=100, default="")
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(null=True, blank=True)
    description = models.TextField(default="")
    content = models.TextField(default="")
    contentType = models.CharField(max_length=20,
                                   choices=contentOptions,
                                   default="text/plain")
    categories = models.TextField(default="")
    commentCount = models.IntegerField(default=0)
    likeCount = models.IntegerField(default=0)

    # URL of the comment
    # i.e. posturl/comments
    comments = models.CharField(max_length=512, null=True, default=None)

    publishedOn = models.DateTimeField(auto_now_add=True, blank=True)

    visibility = models.CharField(max_length=20,
                                  choices=visibilityOptions,
                                  default="public")
    unlisted = models.BooleanField(default=False)

    # Be used by frontend to get username and password of node
    foreign_node_id = None

    # Be used by frontend to get host of node
    foreign_node_host = None

    def __str__(self):
        return str(self.postId) + '-' + self.title

    def save(self, *args, **kwargs):
        if self.origin is None and self.source is None:
            self.source = deploy_host + '/service/post/' + str(self.postId)
            self.origin = deploy_host + '/service/post/' + str(self.postId)
        super(Post, self).save(*args, **kwargs)

    def dict(self):
        return {
            'id': str(self.postId),
            'remoteId': self.remoteId,
            'author': self.author.dict(),
            'title': self.title,
            'source': self.source,
            'origin': self.origin,
            'description': self.description,
            'content': self.content,
            'contentType': self.contentType,
            'categories': self.categories,
            'commentCount': self.commentCount,
            'likeCount': self.likeCount,
            'comments': deploy_host + '/service/post/' + str(self.postId) + '/comments/' if not self.foreign_node_id else self.comments,
            'visibility': self.visibility,
            'published': self.publishedOn.isoformat(),
            'foreignNodeId': self.foreign_node_id,
            'foreignNodeHost': self.foreign_node_host
        }


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

    commentId = models.UUIDField(primary_key=True,
                                 default=uuid.uuid4,
                                 editable=False)
    postId = models.ForeignKey(Post, on_delete=models.CASCADE)
    authorId = models.ForeignKey(Author, on_delete=models.CASCADE)
    publishedOn = models.DateTimeField(auto_now_add=True, blank=True)
    contentType = models.CharField(max_length=20,
                                   choices=contentOptions,
                                   default="text/plain")
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

    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False)

    password_md5 = models.CharField(max_length=32, blank=False, null=False, verbose_name='Admin Password MD5')

    def __str__(self):
        return str(self.id) + ': ' + self.username

    def dict(self):
        return {
            'id': str(self.id),
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

    create_time = models.FloatField(blank=False, null=False, default=time.time, verbose_name='Node create timestamp')

    node_type = models.CharField(max_length=5, blank=False, null=False, choices=TYPE_CHOICE, verbose_name='Node Type')

    if_approved = models.BooleanField(blank=False, null=False, default=True, verbose_name='If approved to connect')

    password_md5 = models.CharField(max_length=32, blank=False, null=False, verbose_name='Auth Password')

    fetch_author_url = \
        models.CharField(max_length=512, blank=True, null=True, default='', verbose_name='Author URL(FETCH)')

    fetch_post_url = \
        models.CharField(max_length=512, blank=True, null=True, default='', verbose_name='Post URL(FETCH)')

    http_username = \
        models.CharField(max_length=512, blank=True, null=True, default='', verbose_name='Http Auth Username(FETCH)')

    http_password = \
        models.CharField(max_length=512, blank=True, null=True, default='', verbose_name='Http Auth Password(FETCH)')

    def dict(self):
        return {
            'id': str(self.nodeId),
            'host': self.host,
            'createTime': self.create_time,
            'nodeType': self.node_type,
            'ifApproved': self.if_approved
        }


def get_path():
    return os.path.join(BASE_DIR, 'media')


class MediaFile(models.Model):
    """
    Media File Model for author head picture
    """

    id = models.UUIDField(default=uuid.uuid4, primary_key=True)

    file_path = models.FilePathField(path=get_path, allow_folders=False, allow_files=True)
