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

import json
import time
import datetime
import requests
import base64
import hashlib
from django.shortcuts import HttpResponse
from main.models import Node, Post, Author
from social.settings import frontend_http_basic_password, frontend_http_basic_username


def __result(code: int, message: str, data: any) -> HttpResponse:
    r = HttpResponse(json.dumps({
        'code': code,
        'message': message,
        'data': data,
        'time': time.time()
    }))
    r['Content-Type'] = 'application/json'
    return r


def success(data: any) -> HttpResponse:
    return __result(200, 'success', data)


def failure(message: str) -> HttpResponse:
    return __result(500, message, None)


def no_auth() -> HttpResponse:
    r = HttpResponse(json.dumps({
        'message': 'you are not allowed to access to this api'
    }))
    r.status_code = 401
    r['Content-Type'] = 'application/json'
    return r


def fetch_posts():
    """
    Fetch data from foreign nodes
    """
    print('Fetching...')
    fetch_nodes = Node.objects.filter(node_type='FETCH')
    result_posts = []
    for node in fetch_nodes:
        try:
            host = node.host
            if not node.if_approved:
                print(f"{host}:Ignored")
                continue
            print(f"{host}:Fetching")
            username = node.http_username
            password = node.http_password
            author_url = node.fetch_author_url
            post_url = node.fetch_post_url

            # Two different type of post URLs
            # first: need author_id
            if '{author_id}' in post_url:
                # Fetch authors
                print(f"\tAuthors,{author_url}")
                result = requests.get(author_url, auth=(username, password),
                                      headers={'Origin': 'https://cmput404f21t17.herokuapp.com/service/'})
                json_obj = result.json()
                if type(json_obj) == list:
                    authors = json_obj
                elif 'items' in json_obj.keys():
                    authors = json_obj['items']
                else:
                    print(f"\t\tnot supported")
                    continue
                # Fetch posts
                print(f"\tPost,{post_url}(With Authors)")
                print('Authors: ' + str(authors))
                for author in authors:
                    print('author: ' + author['id'])
                    author_id = author['id']
                    temp_url = post_url.replace('{author_id}', str(author_id).split('/')[-1])
                    # Fetch posts
                    result = requests.get(temp_url, auth=(username, password),
                                          headers={'Origin': 'https://cmput404f21t17.herokuapp.com/service/'})
                    json_obj = result.json()
                    if type(json_obj) == list:
                        posts = json_obj
                    elif 'items' in json_obj.keys():
                        posts = json_obj['items']
                    else:
                        print(f"\t\tnot supported")
                        continue
                    print('\tposts: ' + str(posts))
                    for item in posts:
                        print('\t\tProcessing: ' + str(item))
                        author = item['author']
                        author = Author(
                            url=author['url'],
                            host=author['host'],
                            displayName=author['displayName'],
                            github=author['github']
                        )
                        post = Post(
                            author=author,
                            remoteId=item.get('id', item.get('post_id', '')),
                            title=item.get('title', 'Title'),
                            source=item.get('source', 'Source'),
                            origin=item.get('origin', 'Origin'),
                            description=item.get('description', 'Description'),
                            content=item.get('content', 'Content'),
                            contentType=item.get('contentType', 'text/plain'),
                            categories=', '.join(list(item.get('categories', 'Categories'))) if type(
                                item.get('categories', 'Categories')) == list else item.get('categories', 'Categories'),
                            commentCount=0,
                            likeCount=len(list(item.get('likes', []))),
                            comments=item.get('comments', 'Comments'),
                            publishedOn=datetime.datetime.strptime(item['published'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                            visibility=str(item.get('visibility', 'PUBLIC')).lower(),
                            unlisted=item.get('unlisted', False),
                        )
                        post.foreign_node_id = str(node.nodeId)
                        post.foreign_node_host = node.host
                        result_posts.append(post.dict())
            # second, not need author_id
            else:
                print(f"\tPost,{post_url}")
                # Fetch posts
                result = requests.get(post_url, auth=(username, password),
                                      headers={'Origin': 'https://cmput404f21t17.herokuapp.com/service/'})
                json_obj = result.json()
                if type(json_obj) == list:
                    posts = json_obj
                elif 'items' in json_obj.keys():
                    posts = json_obj['items']
                else:
                    print(f"\t\tnot supported")
                    continue
                for item in posts:
                    author = item['author']
                    author = Author(
                        url=author['url'],
                        host=author['host'],
                        displayName=author['displayName'],
                        github=author['github']
                    )
                    post = Post(
                        author=author,
                        remoteId=item.get('id', ''),
                        title=item.get('title', 'Title'),
                        source=item.get('source', 'Source'),
                        origin=item.get('origin', 'Origin'),
                        description=item.get('description', 'Description'),
                        content=item.get('content', 'Content'),
                        contentType=item.get('contentType', 'text/plain'),
                        categories=', '.join(list(item.get('categories', 'Categories'))) if type(
                            item.get('categories', 'Categories')) == list else item.get('categories', 'Categories'),
                        commentCount=0,
                        likeCount=len(list(item.get('likes', []))),
                        comments=item.get('comments', 'Comments'),
                        publishedOn=datetime.datetime.strptime(item['published'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                        visibility=str(item.get('visibility', 'PUBLIC')).lower(),
                        unlisted=item.get('unlisted', False),
                    )
                    post.foreign_node_id = str(node.nodeId)
                    post.foreign_node_host = node.host
                    result_posts.append(post.dict())
        except BaseException as e:
            print(e)
    return result_posts


def basic_auth(request):
    if 'HTTP_AUTHORIZATION' in request.META:
        auth = request.META['HTTP_AUTHORIZATION'].split()
        if len(auth) == 2:
            if auth[0].lower() == "basic":
                node_id, password = base64.b64decode(auth[1]).decode().split(':')
                if node_id == frontend_http_basic_username and password == frontend_http_basic_password:
                    # Internal use
                    return AUTH_SUCCESS
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
