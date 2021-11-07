from main.models import Author, Comment, Following, Post # , LikePost
from rest_framework import serializers

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        exclude = ['password']


class PostSerializer(serializers.ModelSerializer):
    # rather than using the `depth` field, must do this or the password shows
    authorId = AuthorSerializer()

    class Meta:
        model = Post
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class FollowingSerializer(serializers.ModelSerializer):
    # rather than using the `depth` field, must do this or the password shows
    followee = AuthorSerializer()
    follower = AuthorSerializer()

    class Meta:
        model = Following
        fields = '__all__'
