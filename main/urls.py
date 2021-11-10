from django.urls import path
from main import views

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
    path('posts/<pk>/comments/', views.comment_list),
    # post like
    path('posts/<pk>/like/', views.like_post),
]
