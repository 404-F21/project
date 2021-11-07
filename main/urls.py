from django.urls import path
from main import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # log in to an existing account
    path('log', views.app_login),

    # view many authors' profiles or register/update an account
    path('authors/', views.all_authors),
    # view one author's profile
    path('author/<pk>/', views.author_profile),

    path('author/<pk>/followers', views.FollowerList.as_view()),

    # get post list & create a post
    path('posts', views.PostList.as_view()),
    # get the specified post details
    path('posts/<pk>', views.PostDetail.as_view()),
    # get the specified post comments
    path('posts/<pk>/comments/', views.comment_list),
    # post like
    path('post/<pk>/like/', views.like_post),
    path('posts/<pk>/like/', views.like_post),
    path('', views.render_html)
]
