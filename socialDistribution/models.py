from django.db import models
import uuid
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
# need to make migrations and then migrate

class Author(models.Model):
	# Author Info

	# will always be appended to the author's URL
	uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, blank=False)
	url = models.CharField(max_length=150, blank=True, null=True)

	# User in the default django table
	user = models.ForeignKey(User, on_delete=models.CASCADE)

	host = models.URLField(blank=True, null=True)  # Url of different hosts
	displayName = models.CharField(max_length=100, unique=True)

	# HATEOS url for GITHUB API???
	github = models.URLField(default="")

	profilePic = models.ImageField(upload_to='profilePics/', blank=True)

	def __str__(self):
		return str(self.uid) + ": " + str(self.displayName)

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
		("application/base64", "application/base64"),
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

	title = models.CharField(max_length=100,default="")
	source = models.URLField(null=True, blank=True)
	origin = models.URLField(null=True, blank=True)
	description = models.TextField(default="")
	contentType = models.CharField(max_length=20, choices=contentOptions, default="text/plain")
	categories = models.TextField(default="")
	commentCount = models.IntegerField(default=0)

	# url to the post's comments
	# basically append "/comments" to the post url 
	commentUrl = models.TextField()

	publishedOn = models.DateTimeField(auto_now_add=True, blank=True)

	visibility = models.CharField(max_length=20, choices=visibilityOptions, default="PUBLIC")
	unlisted = models.BooleanField(default=False)

	def __str__(self):
		return str(self.postId)

class Comment(models.Model):
	contentOptions = (
		("text/markdown", "Common Mark"),
		("text/plain", "Utf-8"),
		("application/base64", "application/base64"),
		("image/png;base64", "PNG"),
		("image/jpeg;base64", "JPEG")
	)

	commentId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	postId = models.ForeignKey(Post, on_delete=models.CASCADE)
	authorId = models.ForeignKey(Author, on_delete=models.CASCADE)
	comment = models.TextField(default="")
	contentType = models.CharField(max_length=20, choices=contentOptions, default="text/plain")
	publishedOn = models.DateTimeField(auto_now_add=True, blank=True)

	def __str__(self):
		return str(self.commentId)

# Not sure how to merge them together
# https://djangocentral.com/creating-comments-system-with-django/
class LikePost(models.Model):
	postId = models.ForeignKey(Post, on_delete=models.CASCADE)
	liker = models.ForeignKey(Author, on_delete=models.CASCADE)

	# TODO
	# Get the id of the author of the post and send an inbox notification

	def __str__(self):
		return self.liker.displayName + " liked your post"

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
	nodeId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

	# ---------------
	# Work in progess
	# ---------------

	pass
