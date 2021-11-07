from main.models import Author, Comment, Post # , LikePost
from rest_framework import serializers

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'host', 'displayName', 'url', 'github', 'profileImage']

class PostSerializer(serializers.ModelSerializer):
    #authorId = AuthorSerializer(many=True)
    class Meta:
        model = Post
        fields = '__all__'
        depth = 1

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

