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


# Setup a timer to fetch nodes content
print('Timer')
task_manager = BackgroundScheduler()
task_manager.add_jobstore(DjangoJobStore())


def fetch_posts():
    print('Fetching...')
    fetch_nodes = Node.objects.filter(node_type='FETCH')
    for node in fetch_nodes:
        url = node.host
        if not node.if_approved:
            print(f"{url}:Ignored")
            continue
        print(f"{url}:Fetching")
        username = node.http_username
        password = node.http_password
        result = requests.get(url, auth=(username, password))
        json_obj = result.json()
        if json_obj['type'] == 'posts':
            for item in json_obj['items']:
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
                        categories=', '.join(list(item['categories'])),
                        commentCount=0,
                        publishedOn=datetime.datetime.strptime(item['published'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                        visibility=str(item['visibility']).lower(),
                        unlisted=item['unlisted']
                    )


task_manager.add_job(fetch_posts, 'interval', id='fetch_content', replace_existing=True, seconds=60)
task_manager.start()
