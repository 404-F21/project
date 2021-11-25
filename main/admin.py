from django.contrib import admin

# Register your models here.
from main.models import Author, Comment, Post, LikePost, Admin, Node
admin.site.register(Author)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(LikePost)
admin.site.register(Admin)
admin.site.register(Node)
