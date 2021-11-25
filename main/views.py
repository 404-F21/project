from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from main.models import Author, Comment, Post, LikePost, Admin, Node
from main.serializers import AuthorSerializer, CommentSerializer, PostSerializer
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from main.decorator import need_admin
from main.response import success, failure, no_auth
from django.db.models import F
from django.core.paginator import Paginator
import uuid
from uuid import UUID
import json
import time
import hashlib
import base64
from django.views.decorators.csrf import csrf_exempt

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
        return HttpResponse(AuthorSerializer.data)

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

'''
@api_view(['GET'])
def author_page(request, pk):
    """
    List all information of an Author, and all of their posts
    """
    if request.method == 'GET':
        author = Author.objects.filter(displayName=pk)
        author_serializer = AuthorSerializer(author.first())
        combined_data = []
        posts = Post.objects.filter(authorId=author.first().id)
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

@api_view(['GET'])
def all_authors(request, pk):
    """
    List all information of an Author, and all of their posts
    """
    if request.method == 'GET':
        author = Author.objects.filter(displayName=pk)
        author_serializer = AuthorSerializer(author.first())
        combined_data = []
        posts = Post.objects.filter(authorId=author.first().id)
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


# APIs for admin functions
# ============================
@csrf_exempt
def admin_login(request):
    """
    Admin login
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        username = json_obj.get('username')
        password = json_obj.get('password')
        if not username or not password:
            return failure('arguments not enough')

        # Check if the user exists
        try:
            admin = Admin.objects.get(username=username)
        except Admin.DoesNotExist:
            return failure('user not exists')
        password_md5 = hashlib.md5(password.encode()).hexdigest()

        if admin.password_md5 == password_md5:
            # Password correct, admin login
            request.session['username'] = username
            request.session['role'] = 'admin'
            return HttpResponse(json.dumps({
                'status': 'ok',
                'type': 'account',
                'currentAuthority': 'admin',
            }))
        else:
            # Password incorrect, fail
            return HttpResponse(json.dumps({
                'status': 'error',
                'type': 'account',
                'currentAuthority': 'guest',
            }))
    else:
        return failure('POST')


@csrf_exempt
def admin_current_user(request):
    """
    Get current login user
    """
    if request.method == 'GET':
        if request.session.get('username', None) is not None:
            return HttpResponse(json.dumps({
                'success': True,
                'data': {
                    'name': request.session['username'],
                    'avatar': 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                    'access': request.session['role']
                }
            }))
        else:
            r = HttpResponse(json.dumps({
                'data': {
                    'isLogin': False,
                },
                'errorCode': '401',
                'errorMessage': 'Login please!',
                'success': True
            }))
            r.status_code = 401
            return r
    else:
        return failure('GET')


@csrf_exempt
def admin_logout(request):
    """
    Admin logout
    """
    del request.session['username']
    del request.session['role']
    return success(None)


@csrf_exempt
@need_admin
def admin_list(request):
    """
    Get admin users list
    """
    if request.method == 'GET':
        # Pagination
        current = request.GET.get('current')
        page_size = request.GET.get('pageSize')
        if not current or not page_size:
            return failure('arguments not enough')
        admins = Admin.objects.all()
        page = Paginator(admins, page_size).page(current)
        obj_list = page.object_list
        results = []
        for admin in obj_list:
            results.append(admin.dict())
        return success({
            'data': results,
            'total': admins.count()
        })
    else:
        return failure('GET')


@csrf_exempt
@need_admin
def admin_create_admin(request):
    """
    Create admin
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        username = json_obj.get('username')
        password = json_obj.get('password')
        if not username or not password:
            return failure('arguments not enough')
        # Check if the user exists
        try:
            Admin.objects.get(username=username)
        except Admin.DoesNotExist:
            password_md5 = hashlib.md5(password.encode()).hexdigest()
            Admin.objects.create(username=username, password_md5=password_md5)
            return success(None)
        return failure('User already exists.')
    else:
        return failure('POST')


@csrf_exempt
@need_admin
def admin_change_password(request):
    """
    Change admin user's password
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        username = json_obj.get('username')
        password = json_obj.get('password')
        if not username or not password:
            return failure('arguments not enough')
        # Check if the user exists
        try:
            admin = Admin.objects.get(username=username)
        except Admin.DoesNotExist:
            return failure('user not exists')
        # Change the password
        password_md5 = hashlib.md5(password.encode()).hexdigest()
        admin.password_md5 = password_md5
        admin.save()
        return success(None)
    else:
        return failure('POST')


@csrf_exempt
@need_admin
def admin_node_list(request):
    """
    Get node list
    """
    if request.method == 'GET':
        # Pagination
        current = request.GET.get('current')
        page_size = request.GET.get('pageSize')
        node_type = request.GET.get('type')
        if not current or not page_size or not node_type:
            return failure('arguments not enough')
        nodes = Node.objects.filter(node_type=node_type)
        page = Paginator(nodes, page_size).page(current)
        obj_list = page.object_list
        results = []
        for node in obj_list:
            results.append(node.dict())
        return success({
            'data': results,
            'total': nodes.count()
        })
    else:
        return failure('GET')


@csrf_exempt
@need_admin
def admin_create_node(request):
    """
    Create node
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        host = json_obj.get('host')
        password = json_obj.get('password')
        node_type = json_obj.get('type')
        # If type of new node is FETCH, then this operation need an another argument: username for HTTP Basic Auth
        username = ''
        if node_type == 'FETCH':
            username = json_obj.get('username')
            if not username:
                return failure('arguments not enough')
        if not host or not password or not node_type:
            return failure('arguments not enough')
        # Check if particular node already exists
        try:
            Node.objects.get(host=host)
        except Node.DoesNotExist:
            password_md5 = hashlib.md5(password.encode()).hexdigest()
            node = Node(
                host=host,
                password_md5=password_md5,
                create_time=time.time(),
                http_username=username,
                node_type=node_type
            )
            node.save()
            return success(None)
        return failure('This host address already exists.')
    else:
        return failure('POST')


@csrf_exempt
@need_admin
def admin_delete_node(request):
    """
    Delete node
    """
    if request.method == 'GET':
        node_id = request.GET.get('id')
        if not node_id:
            return failure('arguments not enough')
        try:
            node = Node.objects.get(nodeId=node_id)
        except Node.DoesNotExist:
            return failure('The node not exists')
        node.delete()
        return success(None)
    else:
        return failure('GET')


@csrf_exempt
@need_admin
def admin_set_node_approved(request):
    """
    Set if a node is allowed to connect
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        node_id = json_obj.get('id')
        if_approved = json_obj.get('approved')
        if not node_id or not if_approved:
            return failure('arguments not enough')
        # Check if particular node already exists
        try:
            node = Node.objects.get(nodeId=node_id)
        except Node.DoesNotExist:
            return failure('The node not exists.')
        node.if_approved = str(if_approved) == '1'
        node.save()
        return success(None)
    else:
        return failure('POST')


@csrf_exempt
def get_public_data(request):
    """
    Get public data on this server, used for providing data to other nodes
    Every different node has its own access password
    """
    if request.method == 'GET':
        if 'HTTP_AUTHORIZATION' in request.META:
            auth = request.META['HTTP_AUTHORIZATION'].split()
            if len(auth) == 2:
                if auth[0].lower() == "basic":
                    node_id, password = base64.b64decode(auth[1]).decode().split(':')
                    password_md5 = hashlib.md5(password.encode()).hexdigest()
                    try:
                        node = Node.objects.get(nodeId=node_id)
                    except Node.DoesNotExist:
                        return failure('id not found')
                    if not node.if_approved or node.password_md5 != password_md5:
                        # Password is incorrect
                        return no_auth()
                    public_posts = Post.objects.filter(visibility='public')
                    result = []
                    for post in public_posts:
                        result.append(post.dict())
                    return success(result)
        return no_auth()
    else:
        return failure('GET')

