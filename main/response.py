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

import threading
import json
import time
import datetime
import requests
from django.shortcuts import HttpResponse
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from main.models import Node, Post, Author


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
    return __result(403, 'you are not allowed to access to this api', None)


def fetch_posts():
    def target():
        print('Fetching...')
        fetch_nodes = Node.objects.filter(node_type='FETCH')
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

                # Fetch authors
                print(f"\tAuthors,{author_url}")
                result = requests.get(author_url, auth=(username, password),
                                      headers={'Origin': 'https://cmput404f21t17.herokuapp.com/service/'})
                json_obj = result.json()
                type(json_obj)
                if type(json_obj) == list:
                    authors = json_obj
                elif 'items' in json_obj.keys():
                    authors = json_obj['items']
                else:
                    print(f"\t\tnot supported")
                    continue
                for author in authors:
                    try:
                        Author.objects.get(url=author['url'])
                    except Author.DoesNotExist:
                        Author.objects.create(
                            url=author['url'],
                            host=author['host'],
                            displayName=author['displayName'],
                            github=author['github']
                        )

                print(f"\tPost,{post_url}")

                def process_posts(posts_input, post_url_input):
                    for item in posts_input:
                        author = item['author']
                        try:
                            author = Author.objects.get(url=author['url'])
                        except Author.DoesNotExist:
                            author = Author.objects.create(
                                url=author['url'],
                                host=author['host'],
                                displayName=author['displayName'],
                                github=author['github']
                            )
                        try:
                            Post.objects.get(remoteId=item['id'])
                        except Post.DoesNotExist:
                            Post.objects.create(
                                author=author,
                                remoteId=item['id'],
                                title=item['title'],
                                source=item['source'],
                                origin=item['origin'],
                                description=item['description'],
                                content=item['content'],
                                contentType=item['contentType'],
                                categories=', '.join(list(item['categories'])) if type(
                                    item['categories']) == list else item['categories'],
                                commentCount=0,
                                publishedOn=datetime.datetime.strptime(item['published'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                                visibility=str(item['visibility']).lower(),
                                unlisted=item['unlisted']
                            )
                    print(f"Processed {post_url_input}")

                if '{author_id}' in post_url:
                    # Adapt anther form
                    for author in authors:
                        author_id = author['id']
                        temp_url = post_url.replace('{author_id}', str(author_id).split('/')[-1])
                        # Fetch posts
                        result = requests.get(temp_url, auth=(username, password),
                                              headers={'Origin': 'https://cmput404f21t17.herokuapp.com/service/'})
                        print(result.text)
                        json_obj = result.json()
                        print(type(json_obj))
                        if type(json_obj) == list:
                            posts = json_obj
                        elif 'items' in json_obj.keys():
                            posts = json_obj['items']
                        else:
                            print(f"\t\tnot supported")
                            continue
                        process_posts(posts, temp_url)
                else:
                    # Fetch posts
                    result = requests.get(post_url, auth=(username, password),
                                          headers={'Origin': 'https://cmput404f21t17.herokuapp.com/service/'})
                    json_obj = result.json()
                    print(type(json_obj))
                    if type(json_obj) == list:
                        posts = json_obj
                    elif 'items' in json_obj.keys():
                        posts = json_obj['items']
                    else:
                        print(f"\t\tnot supported")
                        continue
                    process_posts(posts, post_url)
            except BaseException as e:
                print(e)

    t = threading.Thread(target=target)
    t.start()
