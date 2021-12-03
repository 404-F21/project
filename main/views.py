# Copyright 2021 Nathan Drapeza, Xingjie He, Warren Stix, Yifan Wu

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import requests
from django.contrib.auth.models import User
from django.db.models.query import QuerySet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import Author, Comment, Following, Post, LikePost, Admin, Node
from main.serializers import AuthorSerializer, CommentSerializer, FollowingSerializer, PostSerializer
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from main.decorator import need_admin
from main.response import success, failure, no_auth
from django.db.models import F
from django.core.paginator import Paginator
from django.shortcuts import redirect
from main.response import fetch_posts

import uuid
import json

import time
import base64
from django.views.decorators.csrf import csrf_exempt
import hashlib
from typing import Dict


def paginate(objects: QuerySet, params: Dict[str, str]) -> QuerySet:
    page = int(params.get('page', '1'))
    size = int(params.get('size', '10'))

    begin = (page - 1) * size
    end = begin + size

    return objects[begin:end]


def __basic_auth(request):
    if 'HTTP_AUTHORIZATION' in request.META:
        auth = request.META['HTTP_AUTHORIZATION'].split()
        if len(auth) == 2:
            if auth[0].lower() == "basic":
                node_id, password = base64.b64decode(auth[1]).decode().split(':')
                password_md5 = hashlib.md5(password.encode()).hexdigest()
                try:
                    node = Node.objects.get(nodeId=node_id)
                except Node.DoesNotExist:
                    return 'id not found'
                if not node.if_approved or node.password_md5 != password_md5:
                    # Password is incorrect
                    return 'password incorrect'
                else:
                    return AUTH_SUCCESS
    return 'invalid auth'


AUTH_SUCCESS = 'success'


# Create your views here.
class PostList(APIView):
    """
    List all Posts in the database
    """
    def get(self, request, format=None):
        all_posts = (Post.objects.filter(visibility="public")
                     .order_by('-publishedOn'))
        paged_posts = paginate(all_posts, request.query_params)

        data = []
        for post in paged_posts:
            data.append(post.dict())
        foreign_posts = fetch_posts()
        data = data + foreign_posts
        response = JsonResponse(data, safe=False)
        return response

    def post(self, request, *args, **kwargs):
        if request.content_type == "application/json":
            author = Author.objects.get(pk=uuid.UUID(request.data['authorId']))
            text = request.data['content']
            title = request.data['title']
            contentType = request.data.get('contentType', 'text/plain')
            new_post = Post(author=author,
                            content=text,
                            title=title,
                            contentType=contentType,)
            new_post.save()

        elif request.content_type == "application/x-www-form-urlencoded":
            author = Author.objects.all().first()
            text = request.data['content']
            title = request.data['title']
            new_post = Post(author=author,content=text,title=title)
            # new_post = Post(authorId=author,content=text,title=title)
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
        author = Author.objects.get(pk=uuid.UUID(pk))
        follow_pairs = author.follower_set.all().order_by('follower__displayName')
        paged_pairs = paginate(follow_pairs, request.query_params)
        serializer = FollowingSerializer(paged_pairs, many=True)

        # this list comprehension is required to keep the serializers consistent
        items = [e['follower'] for e in serializer.data]

        return Response({ 'type': 'followers', 'items': items })


class FollowerDetail(APIView):
    def delete(self, request, pk, fpk, format=None):
        try:
            author = Author.objects.get(pk=uuid.UUID(pk))
            follow_pair = author.follower_set.get(follower=uuid.UUID(fpk))
            follow_pair.delete()
            return Response({ 'success': True })
        except (Author.DoesNotExist, Following.DoesNotExist):
            return Response({ 'success': False })

    def put(self, request, pk, fpk, format=None):
        follower = Author.objects.get(pk=uuid.UUID(fpk))
        followee = Author.objects.get(pk=uuid.UUID(pk))

        follow_pair = Following.objects.create(followee=followee, follower=follower)
        follow_pair.save()

        serializer = FollowingSerializer(follow_pair)

        return Response(serializer.data)

    def get(self, request, pk, fpk, format=None):
        try:
            author = Author.objects.get(pk=uuid.UUID(pk))
            author.followee_set.get(follower=uuid.UUID(fpk))
            return Response({ 'isFollower': True })
        except (Author.DoesNotExist, Following.DoesNotExist):
            return Response({ 'isFollower': False })

class FriendList(APIView):
    def get(self, request, pk, format=None):
        author = Author.objects.get(pk=uuid.UUID(pk))
        followers = author.follower_set.all().values_list('follower__id')
        friend_pairs = author.followed_set.filter(followee__id__in=followers).order_by('followee__displayName')
        paged_pairs = paginate(friend_pairs, request.query_params)

        serializer = FollowingSerializer(paged_pairs, many=True)
        items = [e['followee'] for e in serializer.data]
        return Response({'type': 'friends', 'items': items})


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
            'url': author.url,
            'host': author.host,
            'github': author.github
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


class AuthorPostList(APIView):
    def get(self, request, pk, format=None):
        author = Author.objects.get(pk=uuid.UUID(pk))
        posts = author.post_set.all().order_by('-publishedOn')
        result = []
        for post in posts:
            result.append(post.dict())

        return Response({ 'type': 'posts', 'items': result })

    def post(self, request, pk, format=None):
        author = Author.objects.get(pk=uuid.UUID(pk))
        text = request.data['content']
        title = request.data['title']
        new_post = Post.objects.create(authorId=author,content=text,title=title)
        new_post.save()

        return Response({ 'success': True })

class AuthorPostDetail(APIView):
    def get(self, request, pk, pid, format=None):
        author = Author.objects.get(pk=uuid.UUID(pk))
        post = author.post_set.get(pk=uuid.UUID(pid))
        serializer = PostSerializer(post)

        data = dict({ 'type': 'post' }, **serializer.data)
        return Response(data)

    def post(self, request, pk, pid, format=None):
        text = request.data['content']
        title = request.data['title']
        post = Post.objects.get(author__id=uuid.UUID(pk), pk=uuid.UUID(pid))
        post.content = text
        post.title=title
        post.save()

        return Response({ 'success': True })

    def delete(self, request, pk, pid, format=None):
        post = Post.objects.get(author__id=uuid.UUID(pk), pk=uuid.UUID(pid))
        post.delete()

        return Response({ 'success': True })


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
    likepost = LikePost(postId=post, authorId=author)
    likepost.save()
    # let likecount update with itself + 1
    post.likeCount += 1
    post.save()
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
        serializer = PostSerializer(data=request.data['post'])
        if serializer.is_valid():
            serializer.saver()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def get_foreign_data(request, node_id, url_base64):
    """
    Get foreign data (used as a proxy)
    Post dat to foreign url (used as a proxy)
    """
    url = base64.b64decode(url_base64).decode()
    try:
        node = Node.objects.get(nodeId=node_id)
    except Node.DoesNotExist:
        return failure('Node not found')
    username = node.http_username
    password = node.http_password
    if 'http://' in url:
        url = url.replace('http:', 'https:')

    if request.method == 'GET':
        # GET
        result = requests.get(url, auth=(username, password))
        return JsonResponse(result.json())
    elif request.method == 'POST':
        # POST
        try:
            data: dict = json.loads(request.body.decode())
        except json.JSONDecodeError:
            return failure('json data format incorrect')
        result = requests.post(url, data=data, auth=(username, password))
        return JsonResponse(result.json())
    else:
        return failure('GET')


class CommentList(APIView):
    def get(self, request, pk, format=None):
        # check if user is authenticated and if not return a 401

        # https://docs.djangoproject.com/en/dev/ref/models/querysets/#exists
        post = Post.objects.get(pk=pk)
        if post is not None:
            # Check if the post is visible for public/friends/whatever
            #assuming it is visible to all

            comments = Comment.objects.filter(postId=post)
            if comments.count() > 0:
                paged_comments = paginate(comments, request.query_params)
                serializer = CommentSerializer(paged_comments, many=True)
                return JsonResponse(serializer.data, safe=False)
            else:
                return Response("There are no comments on the post", status=404)
        else:
            # return a 404 response
            return Response("Post not found", status=404)

    def post(self, request, pk, format=None):
        # check if user is authenticated and if not return a 401
        post = Post.objects.get(pk=pk)
        if post is not None:

            author = Author.objects.get(pk=uuid.UUID(request.data['authorId']))
            if author is None:
                return HttpResponse('Error, no such author')
            comment = Comment(
                postId = post,
                authorId = author,
                text = request.data['text']
            )
            post.commentCount += 1
            post.save()
            comment.save()
            return HttpResponse(str(comment))

        else:
            # return a 404 response
            return Response("Post not found", status=404)


class AuthorDetail(APIView):
    def get(self, request, pk):
        author = Author.objects.filter(id=pk)
        author_serializer = AuthorSerializer(author.first())
        data = dict()
        data['type'] = 'author'
        data.update(author_serializer.data)
        return JsonResponse(data)

    def post(self, request, pk):
        """
        Update info of a user
        """
        display_name = request.data['displayName']
        github = request.data['github']
        try:
            author = Author.objects.get(id=pk)
        except Author.DoesNotExist:
            return failure('id not found')
        author.displayName = display_name
        author.github = github
        author.save()
        return Response({
            'succ': True
        })


class AuthorList(APIView):
    """
    List all authors in the server, or register a new author
    """
    def get(self, request, format=None):
        authors = paginate(Author.objects.all().order_by('displayName'), request.query_params)
        serializer = AuthorSerializer(authors, many=True)

        data = { 'type': 'authors', 'items': serializer.data }
        return Response(data)

    def post(self, request, format=None):
        displayName = request.data['displayName']
        password = request.data['password']
        uri = request.build_absolute_uri('/')

        user = User.objects.create_user(displayName, password)

        author = Author.objects.create(
            displayName = displayName,
            password = password,
            user = user,
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

# Create your views here.
def render_html(request):
    # create default super user
    if User.objects.count() == 0:
        user = User.objects.create_user('admin', 'test@test.com', 'admin123456')
        user.is_stuff = True
        user.save()
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
            request.session['id'] = str(admin.id)
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
    # Init first admin
    try:
        Admin.objects.get(username='admin')
    except Admin.DoesNotExist:
        Admin.objects.create(username='admin', password_md5=hashlib.md5('admin123456'.encode()).hexdigest())
    if request.method == 'GET':
        if request.session.get('username', None) is not None:
            return HttpResponse(json.dumps({
                'success': True,
                'data': {
                    'id': request.session['id'],
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
def admin_change_password(request, admin_id):
    """
    Change admin user's password
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        password = json_obj.get('password')
        if not admin_id or not password:
            return failure('arguments not enough')
        # Check if the user exists
        try:
            admin = Admin.objects.get(id=admin_id)
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
def admin_node_list(request, node_type):
    """
    Get node list
    """
    if request.method == 'GET':
        # Pagination
        current = request.GET.get('current')
        page_size = request.GET.get('pageSize')
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
def admin_create_node(request, node_type):
    """
    Create node
    """
    # Setup a timer to fetch nodes content
    # if Node.objects.count() == 0:
    #     print('Timer')
    #     task_manager = BackgroundScheduler()
    #     task_manager.add_jobstore(DjangoJobStore())
    #     task_manager.add_job(fetch_posts, 'interval', id='fetch_content', replace_existing=True, seconds=10)
    #     task_manager.start()

    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
        host = json_obj.get('host')
        node_id = json_obj.get('nodeId')
        if not node_id:
            node_id = uuid.uuid4()
        if node_type == 'SHARE':
            password = json_obj.get('password')
            if not host or not password or not node_type:
                return failure('arguments not enough')
            try:
                Node.objects.get(host=host)
            except Node.DoesNotExist:
                password_md5 = hashlib.md5(password.encode()).hexdigest()
                node = Node(
                    nodeId=node_id,
                    host=host,
                    password_md5=password_md5,
                    create_time=time.time(),
                    node_type=node_type
                )
                node.save()
                return success(None)
        else:
            # If type of new node is FETCH, then this operation need an another argument: username for HTTP Basic Auth
            username = json_obj.get('username')
            password = json_obj.get('password')
            author_url = json_obj.get('authorUrl')
            post_url = json_obj.get('postUrl')
            if not host or not username or not password or not author_url or not post_url:
                return failure('arguments not enough')
            try:
                Node.objects.get(host=host)
            except Node.DoesNotExist:
                node = Node(
                    nodeId=node_id,
                    host=host,
                    password_md5='',
                    create_time=time.time(),
                    node_type=node_type,
                    fetch_author_url=author_url,
                    fetch_post_url=post_url,
                    http_username=username,
                    http_password=password
                )
                node.save()
                return success(None)
        return failure('This host address already exists.')
    else:
        return failure('POST')


@csrf_exempt
@need_admin
def admin_delete_node(request, node_id):
    """
    Delete node
    """
    if request.method == 'DELETE':
        if not node_id:
            return failure('arguments not enough')
        try:
            node = Node.objects.get(nodeId=node_id)
        except Node.DoesNotExist:
            return failure('The node not exists')
        node.delete()
        return success(None)
    else:
        return failure('DELETE')


@csrf_exempt
@need_admin
def admin_set_node_approved(request, node_id):
    """
    Set if a node is allowed to connect
    """
    if request.method == 'POST':
        json_obj = json.loads(request.body.decode())
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
def get_public_post(request):
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
                        p = post.dict()
                        p['type'] = 'post'
                        result.append(p)
                    return JsonResponse({
                        'type': 'posts',
                        'items': result
                    })
        return no_auth()
    else:
        return failure('GET')


@csrf_exempt
def get_public_author(request):
    """
    Get authors on this server, used for providing data to other nodes
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
                    authors = Author.objects.all()
                    result = []
                    for author in authors:
                        a = author.dict()
                        a['type'] = 'author'
                        result.append(a)
                    return JsonResponse({
                        "type": "authors",
                        "items": result
                    })
        return no_auth()
    else:
        return failure('GET')


def admin_page_logo(request):
    """
    Redirect request for logo to correct path
    """
    return redirect('/static/ant-design-pro/logo.svg')
