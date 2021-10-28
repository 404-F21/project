from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from main.models import Author, Comment, Post
from main.serializers import AuthorSerializer, CommentSerializer, PostSerializer
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
import uuid
from uuid import UUID
import json

# Create your views here.

@api_view(['GET','POST'])
def home(request):
    """
    List all Posts in the database
    """
    if request.method == 'GET':
        all_posts = Post.objects.filter(visibility="PUBLIC")
        post_serializer = PostSerializer(all_posts, many=True)
        data = post_serializer.data
        response = JsonResponse(data, safe=False)
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        return response
    
    if request.method == 'POST':

        print(request.content_type)
        print(request.body)
        print(request.data)
        print(request.content_type)
        if request.content_type == "application/json":
            author = Author.objects.filter(id=uuid.UUID(request.data['authorId']))[0]
            text = request.data['post_text']
            title = request.data['title']
            new_post = Post(authorId=author,post_text=text,title=title)
            new_post.save()
            
        elif request.content_type == "application/x-www-form-urlencoded":
            author = Author.objects.all()[0]
            text = request.data['post_text']
            title = request.data['title']
            new_post = Post(authorId=author,post_text=text,title=title)
            new_post.save()

        #return Response(request.data)
        return JsonResponse({"a":"b"})

#        return HttpResponse(data)
        #return
    

'''
@api_view(['GET','POST'])
def individual_post(request, pk):
    """
    List a post and all of its comments
    """
    if request.method == 'GET':
        try:
            #post = Post.objects.all()
            post = Post.objects.filter(postId=uuid.UUID(pk))
        except Post.DoesNotExist:
            return HttpResponse(status=404)
        combined_data = []
        comments = Comment.objects.filter(postId=uuid.UUID(pk))
        post[0].commentCount = len(comments)
        post_serializer = PostSerializer(post[0])
        comment_serializer = CommentSerializer(comments, many=True)
        combined_data.append(post_serializer.data)
        combined_data.append(comment_serializer.data)
        return Response(combined_data)
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.saver()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
@api_view(['GET'])
def comment_list(request, pk):
    """
    List all Comments of a Post
    """
    if request.method == 'GET':
        comments = Comment.objects.filter(postId=uuid.UUID(pk))
        serializer = CommentSerializer(comments, many=True)
        #return JsonResponse(serializer.data, safe=False)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.saver()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def author_page(request, pk):
    """
    List all information of an Author, and all of their posts
    """
    if request.method == 'GET':
        author = Author.objects.filter(displayName=pk)
        author_serializer = AuthorSerializer(author[0])
        combined_data = []
        posts = Post.objects.filter(authorId=author[0].id)
        post_serializer = PostSerializer(posts, many=True)
        combined_data.append(author_serializer.data)
        combined_data.append(post_serializer.data)
        return Response(combined_data)

@api_view(['GET'])
def all_authors(request, pk):
    """
    List all information of an Author, and all of their posts
    """
    if request.method == 'GET':
        author = Author.objects.filter(displayName=pk)
        author_serializer = AuthorSerializer(author[0])
        combined_data = []
        posts = Post.objects.filter(authorId=author[0].id)
        post_serializer = PostSerializer(posts, many=True)
        combined_data.append(author_serializer.data)
        combined_data.append(post_serializer.data)
        return Response(combined_data)

    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.saver()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
#https://stackoverflow.com/questions/36588126/uuid-is-not-json-serializable
class UUIDEncoder(json.JSONDecoder):
    def default(self,obj):
        if isinstance(obj, UUID):
            return obj.hex
        return json.JSONEncoder.default(self,obj)