from django.urls import path
from main import views

urlpatterns = [
    #path('', views.home),
    path('', views.PostList.as_view()),
    #path('<pk>/', views.individual_post),
    #path('user/<pk>/', views.author_page),
    path('register/', views.Register.as_view()),
    #path('<pk>/comments/', views.comment_list),
]