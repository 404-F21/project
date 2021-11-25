from django.urls import path
from main import views

from django.conf import settings
from django.conf.urls.static import static

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
    path('', views.render_html),


    # admin login
    path('service/admin/login/', views.admin_login),
    # admin logout
    path('service/admin/logout/', views.admin_logout),
    # get admin users list
    path('service/admin/list/', views.admin_list),
    # create admin
    path('service/admin/create/', views.admin_create_admin),
    # change admin user's password
    path('service/admin/password/', views.admin_change_password),
    # get nodes list
    path('service/admin/node/list/', views.admin_node_list),
    # create node
    path('service/admin/node/create/', views.admin_create_node),
    # delete node
    path('service/admin/node/delete/', views.admin_delete_node),
    # set node permission
    path('service/admin/node/approved/', views.admin_set_node_approved),
    # get current admin user login
    path('service/admin/current/', views.admin_current_user),

    # provide public data to other nodes
    path('connect/public/', views.get_public_data)
]