from django.contrib import admin

# Register your models here.
from main.models import Author, Comment, Post, LikePost
admin.site.register(Author)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(LikePost)
