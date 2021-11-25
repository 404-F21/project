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
from django.shortcuts import HttpResponse
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from main.models import Node, Post


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
# task_manager = BackgroundScheduler()
# task_manager.add_jobstore(DjangoJobStore())
#
#
# def fetch_content():
#     fetch_nodes = Node.objects.filter(node_type='FETCH')
#     for node in fetch_nodes:
#         url = node.host
#
#
# task_manager.add_job(fetch_content, 'cron', id='fetch_content', replace_existing=True, hour=0, minute=1, second=0)
