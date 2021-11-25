# Copyright 2021 Xingjie He, Yifan Wu, Kanishk Chawla

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# Register your models here.
from main.models import Author, Comment, Post, LikePost, Admin, Node
from django.contrib import admin
# from rest_framework.authtoken.admin import TokenAdmin


admin.site.register(Author)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(LikePost)
admin.site.register(Admin)
admin.site.register(Node)

# TokenAdmin.raw_id_fields = ('user',)
