from django.urls import path
from main import views

urlpatterns = [
    #path('', views.home),
    #path('<pk>/', views.individual_post),
    #path('user/<pk>/', views.author_page),
    path('register', views.Register.as_view()),
    path('log', views.login),

    # get post list & create a post
    path('post', views.PostList.as_view()),
    # get the specified post details
    path('post/<pk>', views.individual_post),
    # get the specified post comments
    path('post/<pk>/comments/', views.comment_list),
    # post like
    path('post/<pk>/like/', views.like_post),
]