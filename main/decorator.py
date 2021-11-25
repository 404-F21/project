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

from main.response import no_auth


def need_admin(view_func):
    """
    Restrict the permission, only allow admin role to access
    """
    def inner(request):
        """
        Check the permission
        """
        username = request.session.get('username')
        role = request.session.get('role')
        if username and role and role == 'admin':
            return view_func(request)
        return no_auth()

    return inner
