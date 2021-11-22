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


from django.urls import path
from main import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # log in to an existing account
    path('log', views.app_login),

    # view many authors' profiles or register/update an account
    path('authors/', views.AuthorList.as_view()),
    # view one author's profile
    path('author/<pk>/', views.AuthorDetail.as_view()),
    # view all of an author's followers
    path('author/<pk>/followers', views.FollowerList.as_view()),

    path('author/<pk>/followers/<fpk>', views.FollowerDetail.as_view()),
    path('author/<pk>/friends', views.FriendList.as_view()),

    path('author/<pk>/posts/', views.AuthorPostList.as_view()),
    path('author/<pk>/posts/<pid>', views.AuthorPostDetail.as_view()),

    # get post list & create a post
    path('posts', views.PostList.as_view()),
    # get the specified post details
    path('posts/<pk>', views.PostDetail.as_view()),
    # get the specified post comments
    # path('posts/<pk>/comments/', views.comment_list),
    path('posts/<pk>/comments/', views.CommentList.as_view()),
    # post like
    path('post/<pk>/like/', views.like_post),
    path('posts/<pk>/like/', views.like_post),
    path('', views.render_html),

    # admin login
    path('admin/login/', views.admin_login),
    # admin logout
    path('admin/logout/', views.admin_logout),
    # get admin users list
    path('admin/list/', views.admin_list),
    # change admin user's password
    path('admin/password/', views.admin_change_password),
    # get nodes list
    path('admin/node/list/', views.admin_node_list),
    # create node
    path('admin/node/create/', views.admin_create_node),
    # delete node
    path('admin/node/delete/', views.admin_delete_node),
    # set node permission
    path('admin/node/approved/', views.admin_set_node_approved),
    # get current admin user login
    path('admin/current/', views.admin_current_user),

    # provide public data to other nodes
    path('connect/public/', views.get_public_data)
]
