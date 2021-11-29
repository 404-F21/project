# Copyright 2021 Nathan Drapeza, Warren Stix

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


from main.models import Author, Comment, Following, Post # , LikePost
from rest_framework import serializers

from social.settings import SITE

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    def get_id(self, obj : Author):
        return f"{SITE}author/{obj.id}/"
    class Meta:
        model = Author
        exclude = ['password']


class PostSerializer(serializers.ModelSerializer):
    # rather than using the `depth` field, must do this or the password shows
    author = AuthorSerializer()

    id = serializers.SerializerMethodField()
    
    def get_id(self, obj : Post):
        return f"{SITE}author/{obj.author.id}/posts/{obj.postId}/"
    
    
    class Meta:
        model = Post
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    authorId = AuthorSerializer()
    
    id = serializers.SerializerMethodField()
    
    def get_id(self, obj : Comment):
        return f"{SITE}author/{obj.authorId}/posts/{obj.postId}/comments/{obj.commentId}/"

    class Meta:
        model = Comment
        fields = '__all__'


class FollowingSerializer(serializers.ModelSerializer):
    # rather than using the `depth` field, must do this or the password shows
    followee = AuthorSerializer()
    follower = AuthorSerializer()

    class Meta:
        model = Following
        exclude = ['id']
