# Copyright 2021 Xingjie He, Yifan Wu

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from main.response import no_auth


def need_admin(view_func):
    """
    Restrict the permission, only allow admin role to access
    """
    def inner(request, admin_id=None, node_type=None, node_id=None):
        """
        Check the permission
        """
        username_session = request.session.get('username')
        role = request.session.get('role')
        if username_session and role and role == 'admin':
            if admin_id:
                return view_func(request, admin_id)
            elif node_type:
                return view_func(request, node_type)
            elif node_id:
                return view_func(request, node_id)
            else:
                return view_func(request)
        return no_auth()

    return inner
