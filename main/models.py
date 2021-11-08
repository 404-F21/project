from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
# from django.contrib.auth import authenticate


class Author(AbstractBaseUser):
    '''
    A user who can make posts, friends, comments, and like posts.
    '''

    '''
    Private information
    '''
    password = models.CharField(max_length=25, default = "", blank=True)
    '''
    Public information
    '''
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False,
                          blank=False)

    url = models.CharField(max_length=150, blank=True, null=True)

    host = models.URLField(blank=True, null=True)
    displayName = models.CharField(max_length=100, default="", unique=True)

    # Potentially the future home of the HATEOS URL for github API
    github = models.URLField(default="")

    profileImage = models.ImageField(upload_to='profilePics/', blank=True)

    USERNAME_FIELD = "displayName"
    REQUIRED_FIELDS = ["password"]

    def save(self, *args, **kwargs):
        self.url = f'{self.host}author/{self.id}'
        super(Author, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id) + ": " + str(self.displayName)


class Admin(Author):
    '''TODO: the whole damned model'''


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
                                 related_name='follower_set',
                                 on_delete=models.CASCADE,
                                 editable=False)
    followee = models.ForeignKey(Author,
                                 related_name='followee_set',
                                 on_delete=models.CASCADE,
                                 editable=False)

    class Meta:
        unique_together = ('follower', 'followee')
        constraints = [models.CheckConstraint(
            name = 'follower_ne_followee',
            check = ~models.Q(follower=models.F('followee')),
        )]


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

    postId = models.UUIDField(primary_key=True,
                              default=uuid.uuid4,
                              editable=False)
    authorId = models.ForeignKey(Author, on_delete=models.CASCADE)

    title = models.CharField(max_length=100, default="")
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(null=True, blank=True)
    description = models.TextField(default="")
    post_text = models.TextField(default="")
    contentType = models.CharField(max_length=20,
                                   choices=contentOptions,
                                   default="text/plain")
    categories = models.TextField(default="")
    commentCount = models.IntegerField(default=0)
    likeCount = models.IntegerField(default=0)

    # URL of the comment
    # i.e. posturl/comments
    commentUrl = models.TextField(default=postId)

    publishedOn = models.DateTimeField(auto_now_add=True, blank=True)

    visibility = models.CharField(max_length=20,
                                  choices=visibilityOptions,
                                  default="PUBLIC")
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

class Node(models.Model):
	nodeId = models.UUIDField(primary_key=True,
                              default=uuid.uuid4,
                              editable=False)

	# ---------------
	# Work in progess
	# ---------------

	pass
