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


from django.test import TestCase, Client
from django.urls import reverse
from .serializers import AuthorSerializer, PostSerializer, CommentSerializer
# Create your tests here.
from main.models import Author, Post, Comment
# from .models import Author, Post, Comment
from uuid import UUID
from django.contrib.auth.models import User

class AuthorModelTests(TestCase):

    def test_value_assignment(self):
        """
        Tests if Author object creation functions properly
        """
        self.user1 = User.objects.create_user('user1', password='user1Password')
        self.user1.save()
        self.client1 = Client()
        self.client1.login(displayName='User1', password='user1Password')
        author1 = Author(displayName="User1", password="user1Password", github="user1@github.com")
        self.assertEqual(author1.displayName, "User1")
        self.assertEqual(author1.github, "user1@github.com")
        
        self.user2 = User.objects.create_user('user2', password='user2Password')
        self.user2.save()
        self.client2 = Client()
        self.client2.login(displayName='User2', password='user2Password')
        author2 = Author(displayName="User2", password="user2Password", github="user2@github.com")
        self.assertEqual(author2.displayName, "User2")
        self.assertEqual(author2.github, "user2@github.com")

class PostModelTests(TestCase):

    def test_value_assignment(self):
        """
        Tests if Post object properly created.
        """
        # temporery test author object
        temp_author_foreign_key = Author(displayName="User1",github="user1@github.com")

        # Post with just author primary key
        post = Post(author=temp_author_foreign_key)
        self.assertEqual(type(post), Post)
        self.assertEqual(post.author, temp_author_foreign_key)
        self.assertEqual(post.title, "")
        self.assertEqual(post.content, "")
        self.assertEqual(post.description, "")
        self.assertEqual(post.visibility, "public")
        self.assertEqual(post.unlisted, False)

        # Post with a title, text, and description
        post = Post(author=temp_author_foreign_key, title="unit testing", content="test test 123", description="test description")
        self.assertEqual(type(post), Post)
        self.assertEqual(post.author, temp_author_foreign_key)
        self.assertEqual(post.title, "unit testing")
        self.assertEqual(post.content, "test test 123")
        self.assertEqual(post.description, "test description")
        self.assertEqual(post.visibility, "public")
        self.assertEqual(post.unlisted, False)

        # Testing other fields
        post = Post(author=temp_author_foreign_key, visibility="FRIENDS", commentCount = 12, likeCount = 500, unlisted=True)
        self.assertEqual(type(post), Post)
        self.assertEqual(post.visibility, "FRIENDS")
        self.assertEqual(post.commentCount, 12)
        self.assertEqual(post.likeCount, 500)
        self.assertEqual(post.unlisted, True)

class CommentModelTests(TestCase):
    def test_value_assignment(self):

        temp_author_foreign_key = Author(displayName="user1",github="user1@github.com")
        temp_post_foreign_key = Post(author=temp_author_foreign_key)

        # No parameters
        comment = Comment()
        self.assertEqual(type(comment), Comment)

        # Basic parameters
        comment = Comment(authorId=temp_author_foreign_key,postId=temp_post_foreign_key, text="test text\n\n\n")
        self.assertEqual(type(comment), Comment)
        self.assertEqual(comment.postId.postId, temp_post_foreign_key.postId)
        self.assertEqual(comment.text, "test text\n\n\n")

class AuthorSerializerTests(TestCase):

    def test_value_assignment(self):

        # no parameter
        temp_author = Author()
        serializer = AuthorSerializer(temp_author)
        self.assertEqual(type(serializer), AuthorSerializer)

        temp_author = Author(displayName="user1",github="user1@github.com")

        # only authorId in parameter
        serializer = AuthorSerializer(temp_author)
        self.assertEqual(serializer.data['displayName'], "user1")
        self.assertEqual(serializer.data['github'], "user1@github.com")
        self.assertEqual(serializer.data['url'], None)
        self.assertEqual(serializer.data['host'], None)
        self.assertEqual(serializer.data['profilePic'], "")

        # host in parameter
        temp_author = Author(host = "http://www.user1.com")
        self.assertEqual(type(serializer.data['id']), str)

class PostSerializerTests(TestCase):

    def test_value_assignment(self):
        temp_post = Post()
        serializer = PostSerializer(temp_post)
        self.assertEqual(type(serializer), PostSerializer)

        temp_author = Author(displayName="user1",github="user1@github.com")
        temp_post = Post(author=temp_author, content="test text")

        # authorId, postId, and content values
        serializer = PostSerializer(temp_post)
        self.assertEqual(serializer.data['description'], "")
        self.assertEqual(serializer.data['title'], "")


class CommentSerializerTests(TestCase):

    def test_value_assignment(self):
        temp_comment = Comment()
        serializer = CommentSerializer(temp_comment)
        self.assertEqual(type(serializer), CommentSerializer)

        temp_author = Author(displayName="user1",github="user1@github.com")
        temp_post = Post(author=temp_author, content="test text")


        temp_comment = Comment(authorId=temp_author, postId=temp_post, text="test text")
        # text parameter
        serializer = CommentSerializer(temp_comment)
        self.assertEqual(serializer.data['text'], "test text")
    
