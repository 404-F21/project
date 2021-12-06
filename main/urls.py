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
from rest_framework.schemas import get_schema_view

urlpatterns = [
    # root API path
    path('', get_schema_view(
        title="Team 17's Social Network API",
        description="A social network built with React and DRF",
        version="1.0.0"
    ), name='openapi-schema'),

    # log in to an existing account
    path('log', views.app_login),

    # view many authors' profiles or register/update an account
    path('authors/', views.AuthorList.as_view()),
    # view one author's profile
    path('author/<pk>/', views.AuthorDetail.as_view()),

    # view all of an author's followers
    path('author/<pk>/followers', views.FollowerList.as_view()),
    path('author/<pk>/followers/<fpk>', views.FollowerDetail.as_view()),
    path('author/<pk>/followed', views.FollowedList.as_view()),
    path('author/<pk>/followed/<fpk>', views.FollowedDetail.as_view()),
    path('author/<pk>/friends', views.FriendList.as_view()),

    # add friends: (<d> stands for decision)
    #path('author/<pk>/friends/<fpk>/<d>', views.FriendDetail.as_view()),
    
    path('author/<pk>/posts/', views.AuthorPostList.as_view()),
    path('author/<pk>/posts/<pid>', views.AuthorPostDetail.as_view()),
    # Reshare post
    path('author/<author_id>/posts/<post_id>/reshare/', views.reshare_post),
    path('foreign-post/reshare/<reshare_aid>/', views.reshare_post_foreign),

    # get post list & create a post
    path('posts', views.PostList.as_view()),
    # get the specified post details
    path('post/<pk>', views.PostDetail.as_view()),
    # get the specified post comments
    # path('posts/<pk>/comments/', views.comment_list),
    path('post/<pk>/comments/', views.CommentList.as_view()),
    # post like
    path('post/<pk>/like/', views.like_post),
    # Get foreign data with associated auth info (used as a proxy)
    path('foreign-data/<str:node_id>/<str:url_base64>', views.get_foreign_data),

    # get the post inbox notifications of a user
    path('inbox_posts/<pk>', views.post_notifications),

    # get the post inbox notifications of a user
    path('inbox_friends', views.friend_notifications),

    # admin login
    path('admin/login/', views.admin_login),
    # admin logout
    path('admin/logout/', views.admin_logout),
    # get admin users list
    path('admin/list/', views.admin_list),
    # create admin
    path('admin/create/', views.admin_create_admin),
    # change admin user's password
    path('admin/password/<str:admin_id>/', views.admin_change_password),
    # get nodes list
    path('admin/node/list/<str:node_type>/', views.admin_node_list),
    # create node
    path('admin/node/create/<str:node_type>/', views.admin_create_node),
    # delete node
    path('admin/node/delete/<str:node_id>/', views.admin_delete_node),
    # set node permission
    path('admin/node/approved/<str:node_id>/', views.admin_set_node_approved),
    # get current admin user login
    path('admin/current/', views.admin_current_user),

    # provide public posts to other nodes
    path('connect/public/', views.get_public_post),
    # provide authors to other nodes
    path('connect/public/author/', views.get_public_author)
]
