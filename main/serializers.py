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

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        exclude = ['password']


class PostSerializer(serializers.ModelSerializer):
    # rather than using the `depth` field, must do this or the password shows
    author = AuthorSerializer()

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
        exclude = ['id']
