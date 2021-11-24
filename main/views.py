from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework.views import APIView
from main.models import Author, Comment, Following, Post, LikePost
from main.serializers import AuthorSerializer, CommentSerializer, FollowingSerializer, PostSerializer
from django.http import HttpResponse, JsonResponse
from django.db.models import F
# from django.contrib.auth import authenticate, login
import uuid

# Create your views here.
class PostList(APIView):
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
            author = Author.objects.get(pk=uuid.UUID(request.data['authorId']))
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


class Register(APIView):
    def post(self, request, format=None):
        author = Author.objects.create(
            displayName = request.data['displayName'],
            password = request.data["password"],
        )
        author.save()
        ser = AuthorSerializer(author)
        return Response(ser.data)


class FollowerList(APIView):
    def get(self, request, pk, format=None):
        author = Author.objects.get(pk=pk)
        follow_pairs = author.followee_set.all()
        serializer = FollowingSerializer(follow_pairs, many=True)

        # this list comprehension is required to keep the serializers consistent
        items = [e['follower'] for e in serializer.data]

        return Response({ 'type': 'followers', 'items': items })


class FollowerDetail(APIView):
    def delete(self, request, pk, fpk, format=None):
        try:
            author = Author.objects.get(pk=pk)
            follow_pair = author.followee_set.get(follower=fpk)
            follow_pair.delete()
            return Response({ 'success': True })
        except (Author.DoesNotExist, Following.DoesNotExist):
            return Response({ 'success': False })

    def put(self, request, pk, fpk, format=None):
        follower = Author.objects.get(pk=fpk)
        followee = Author.objects.get(pk=pk)

        follow_pair = Following.objects.create(followee=followee, follower=follower)
        follow_pair.save()

        serializer = FollowingSerializer(follow_pair)

        return Response(serializer.data)

    def get(self, request, pk, fpk, format=None):
        try:
            author = Author.objects.get(pk=pk)
            author.followee_set.get(follower=fpk)
            return Response({ 'isFollower': True })
        except (Author.DoesNotExist, Following.DoesNotExist):
            return Response({ 'isFollower': False })


@api_view(['POST'])
def app_login(request):
    name = request.data['displayName']
    pwd = request.data['password']

    '''
    author = authenticate(request, username=name, password=pwd)
    if author is not None:
    '''
    try:
        author = Author.objects.get(displayName=name, password=pwd)
        # login(request, author)

        return Response({
            'succ': True,
            'id': str(author.pk),
        })
    except Author.DoesNotExist:
        return Response({ 'succ': False })


class PostDetail(APIView):
    """
    List an individual post
    """
    def get(self, request, pk, format=None):
        try:
            post = Post.objects.get(postId=uuid.UUID(pk))
        except Post.DoesNotExist:
            return HttpResponse(status=404)
        combined_data = []
        post_serializer = PostSerializer(post)
        return JsonResponse(post_serializer.data)


@api_view(['POST'])
def like_post(request, pk):
    post_id = uuid.UUID(pk)
    author_id = uuid.UUID(request.data['authorId'])

    post = Post.objects.get(postId=post_id)
    author = Author.objects.get(id=author_id)
    # check if already exists 
    likes = LikePost.objects.filter(postId=post_id, authorId=author_id)
    if len(likes):
        # already liked can not like again
        return Response({ 'succ': False })
    likepost = LikePost(postId=post[0], authorId=author[0])
    likepost.save()
    # let likecount update with itself + 1
    post.update(likeCount=F('likeCount') + 1)
    return Response({
        'succ': True,
        'count': post.likeCount
    })

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

class AuthorDetail(APIView):
    """
    List all of an Author's information
    """
    def get(self, request, pk, format=None):
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
'''

class AuthorList(APIView):
    """
    List all authors in the server, or register a new author
    """
    def get(self, request, format=None):
        page = int(request.query_params.get('page', '1'))
        size = int(request.query_params.get('size', '5'))
        begin = (page - 1) * size
        end = begin + size
        authors = Author.objects.all()[begin:end]
        serializer = AuthorSerializer(authors, many=True)

        data = { 'type': 'authors', 'items': serializer.data }
        return Response(data)

    def post(self, request, format=None):
        uri = request.build_absolute_uri('/')

        author = Author.objects.create(
            displayName = request.data['displayName'],
            password = request.data["password"],
            host = uri,
        )
        author.save()
        ser = AuthorSerializer(author)
        return Response(ser.data)


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
