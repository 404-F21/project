from django.urls import path
from main import views

urlpatterns = [
    path('', views.home),
    path('<pk>/', views.individual_post),
    path('user/<pk>/', views.author_page),
    path('<pk>/comments', views.comment_list),
]