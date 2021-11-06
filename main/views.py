from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from main.models import Author, Comment, Post, LikePost
from main.serializers import AuthorSerializer, CommentSerializer, PostSerializer
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.db.models import F
import uuid
from uuid import UUID
import json

# Create your views here.
class PostList(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """
    List all Posts in the database
    """

    def get(self, request, format=None):
        all_posts = Post.objects.filter(visibility="PUBLIC").order_by('-publishedOn')[:5]
        post_serializer = PostSerializer(all_posts, many=True)
        data = post_serializer.data
        response = JsonResponse(data, safe=False)
        return response

    def post(self, request, format=None):

        #print(request.body)
        #print(request.data)
        #print(request.content_type)
        if request.content_type == "application/json":
            author = Author.objects.filter(id=uuid.UUID(request.data['authorId'])).first()
            text = request.data['post_text']
            title = request.data['title']
            new_post = Post(authorId=author,post_text=text,title=title)
            new_post.save()
            
        elif request.content_type == "application/x-www-form-urlencoded":
            author = Author.objects.all().first()
            text = request.data['post_text']
            title = request.data['title']
            new_post = Post(authorId=author,post_text=text,title=title)
            new_post.save()

        #return Response(request.data)
        #return Response(status=status.HTTP_201_CREATED)
        return HttpResponse("post created")

class Register(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    def post(self, request, format=None):
        author = Author(
            displayName = request.data['displayName'],
            password = request.data["password"],
        )
        author.save()
        ser = AuthorSerializer(author)
        return Response(ser.data)

@api_view(['POST'])
def login(request):
    name = request.data['displayName']
    pwd = request.data['password']
    author = Author.objects.filter(displayName = name, password = pwd)
    if len(author):
        # TODO generate a token response it to client
        return HttpResponse(json.dumps({
            'succ': True,
            'id': str(author[0].id),
        }))
    return HttpResponse(json.dumps({
        'succ': False
    }))

@api_view(['GET'])
def individual_post(request, pk):
    """
    List an individual post
    """
    if request.method == 'GET':
        try:
            post = Post.objects.filter(postId=uuid.UUID(pk))
        except Post.DoesNotExist:
            return HttpResponse(status=404)
        combined_data = []
        post_serializer = PostSerializer(post.first())
        return JsonResponse(post_serializer.data)

@api_view(['POST'])
def like_post(request, pk):
    post = Post.objects.filter(postId=uuid.UUID(pk))
    author = Author.objects.filter(id=uuid.UUID(request.data['authorId']))
    # check if already exists 
    likes = LikePost.objects.filter(postId=post[0], authorId=author[0])
    if len(likes):
        # already liked can not like again
        return HttpResponse(json.dumps({
            'succ': False
        }))
    likepost = LikePost(postId=post[0], authorId=author[0])
    likepost.save()
    # let likecount update with itself + 1
    post.update(likeCount=F('likeCount') + 1)
    return HttpResponse(json.dumps({
        'succ': True,
        'count': post[0].likeCount
    }))

@api_view(['GET','POST'])
def comment_list(request, pk):
    """
    List all Comments of a Post
    """
    # get simply gets all comments from a single post
    if request.method == 'GET':
        comments = Comment.objects.filter(postId=uuid.UUID(pk))
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False)

    """
    Create a Comment of a Post
    """
    # post will be used to comment on a Post
    if request.method == 'POST':
        post = Post.objects.filter(postId=uuid.UUID(request.data['postId']))
        author = Author.objects.filter(id=uuid.UUID(request.data['authorId']))
        comment = Comment(
            postId = post[0],
            authorId = author[0],
            text = request.data['text']
        )
        post.update(commentCount=F('commentCount') + 1)
        comment.save()
        return HttpResponse(str(comment))
        # serializer = PostSerializer(data=request.data['post'])
        # if serializer.is_valid():
        #     serializer.saver()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def author_profile(request, pk):
    """
    List all of an Author's information
    """
    if request.method == 'GET':
        author = Author.objects.filter(id=pk)
        author_serializer = AuthorSerializer(author.first())
        data = dict()
        data['type'] = 'author'
        data.update(author_serializer.data)
        return Response(data)
'''
@api_view(['GET'])
def author_page(request, pk):
    """
    List all information of an Author, and all of their posts
    """
    if request.method == 'GET':
        author = Author.objects.filter(id=pk)
        author_serializer = AuthorSerializer(author.first())
        posts = Post.objects.filter(authorId=pk)
        post_serializer = PostSerializer(posts, many=True)
        combined_data.append(author_serializer.data)
        combined_data.append(post_serializer.data)
        return Response(combined_data)

@api_view(['GET','POST'])
def new_author(request):
    """
    Make a new author
    """
    if request.method == 'POST':
        author = Author(displayName = request.data['displayName'])
'''

@api_view(['GET'])
def all_authors(request):
    """
    List all authors in the server
    """
    if request.method == 'GET':
        page = int(request.query_params.get('page', '1'))
        size = int(request.query_params.get('size', '5'))
        begin = (page - 1) * size
        end = begin + size
        authors = Author.objects.all()[begin:end]
        serializer = AuthorSerializer(authors, many=True)

        data = { 'type': 'authors', 'items': serializer.data }
        return Response(data)


'''
@api_view(['POST'])
def like(request, pk):
    """
    Lists all likes for one Post
    """
    if request.method == 'POST':
        serializer = LikeSerializer()
        if serializer.is_valid():
            serializer.saver()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''


from django.shortcuts import render
# Create your views here.
def render_html(request):
    return render(request, 'index.html') 