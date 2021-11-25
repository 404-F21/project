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


from django.test import TestCase

from .serializers import AuthorSerializer, PostSerializer, CommentSerializer
# Create your tests here.
from .models import Author, Post, Comment
from uuid import UUID

class AuthorModelTests(TestCase):

    def test_value_assignment(self):
        """
        Tests if Author object creation functions properly
        """
        author = Author(displayName="ishq_kan",github="kanishk@github.com")
        self.assertEqual(author.displayName, "ishq_kan")
        self.assertEqual(author.github, "kanishk@github.com")
        # self.assertEqual(type(author.uid), UUID)
        # proper_id_and_name = f"{str(author.uid)}: {author.displayName}"
        # check string representation compared to proper form
        # self.assertEqual(str(author), proper_id_and_name)
    
class PostModelTests(TestCase):

    def test_value_assignment(self):
        """
        Tests if Post object properly created.
        """
        # temporery test author object
        temp_author_foreign_key = Author(displayName="ishq_kan",github="kanishk@github.com")

        # Post with just author primary key
        post = Post(authorId=temp_author_foreign_key)
        self.assertEqual(type(post), Post)
        self.assertEqual(post.authorId, temp_author_foreign_key)
        self.assertEqual(post.title, "")
        self.assertEqual(post.content, "")
        self.assertEqual(post.description, "")
        self.assertEqual(post.visibility, "PUBLIC")
        self.assertEqual(post.unlisted, False)

        # Post with a title, text, and description
        post = Post(authorId=temp_author_foreign_key, title="unit testing", content="test test 123", description="test description")
        self.assertEqual(type(post), Post)
        self.assertEqual(post.authorId, temp_author_foreign_key)
        self.assertEqual(post.title, "unit testing")
        self.assertEqual(post.content, "test test 123")
        self.assertEqual(post.description, "test description")
        self.assertEqual(post.visibility, "PUBLIC")
        self.assertEqual(post.unlisted, False)

        # Testing other fields
        post = Post(authorId=temp_author_foreign_key, visibility="FRIENDS", commentCount = 12, likeCount = 500, unlisted=True)
        self.assertEqual(type(post), Post)
        self.assertEqual(post.visibility, "FRIENDS")
        self.assertEqual(post.commentCount, 12)
        self.assertEqual(post.likeCount, 500)
        self.assertEqual(post.unlisted, True)

class CommentModelTests(TestCase):
    def test_value_assignment(self):

        temp_author_foreign_key = Author(displayName="ishq_kan",github="kanishk@github.com")
        temp_post_foreign_key = Post(authorId=temp_author_foreign_key)

        # No parameters
        comment = Comment()
        self.assertEqual(type(comment), Comment)

        # Basic parameters
        comment = Comment(authorId=temp_author_foreign_key,postId=temp_post_foreign_key, text="test text\n\n\n")
        self.assertEqual(type(comment), Comment)
        # self.assertEqual(comment.authorId.id, temp_author_foreign_key.uid)
        self.assertEqual(comment.postId.postId, temp_post_foreign_key.postId)
        self.assertEqual(comment.text, "test text\n\n\n")

class AuthorSerializerTests(TestCase):

    def test_value_assignment(self):

        # no parameter
        temp_author = Author()
        serializer = AuthorSerializer(temp_author)
        self.assertEqual(type(serializer), AuthorSerializer)

        temp_author = Author(displayName="ishq_kan",github="kanishk@github.com")

        # only authorId in parameter
        serializer = AuthorSerializer(temp_author)
        self.assertEqual(serializer.data['displayName'], "ishq_kan")
        self.assertEqual(serializer.data['github'], "kanishk@github.com")
        self.assertEqual(serializer.data['url'], None)
        self.assertEqual(serializer.data['host'], None)
        self.assertEqual(serializer.data['profilePic'], None)

        # host in parameter
        temp_author = Author(host = "http://www.kanishk.com")
        self.assertEqual(type(serializer.data['id']), str)

class PostSerializerTests(TestCase):

    def test_value_assignment(self):
        temp_post = Post()
        serializer = PostSerializer(temp_post)
        self.assertEqual(type(serializer), PostSerializer)

        temp_author = Author(displayName="ishq_kan",github="kanishk@github.com")
        temp_post = Post(authorId=temp_author, content="test text")

        # authorId, postId, and content values
        serializer = PostSerializer(temp_post)
        self.assertEqual(serializer.data['description'], "")
        self.assertEqual(serializer.data['title'], "")


class CommentSerializerTests(TestCase):

    def test_value_assignment(self):
        temp_comment = Comment()
        serializer = CommentSerializer(temp_comment)
        self.assertEqual(type(serializer), CommentSerializer)

        temp_author = Author(displayName="ishq_kan",github="kanishk@github.com")
        temp_post = Post(authorId=temp_author, content="test text")


        temp_comment = Comment(authorId=temp_author, postId=temp_post, text="test text")
        # text parameter
        serializer = CommentSerializer(temp_comment)
        self.assertEqual(serializer.data['text'], "test text")
    
