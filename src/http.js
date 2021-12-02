/* Copyright 2021 Xingjie He, Warren Stix, Yifan Wu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *		http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios from "axios"

const protocol = window.location.protocol;
const host = window.location.host;

export const client = axios.create({
    baseURL: `${protocol}//${host}/service/`,
    // baseURL: `http://localhost:8000/service/`,
    auth: {
        username: 'bc8e0ebd-c591-4e7c-81f9-89aede953302',
        password: '440bfadd-d21e-48c3-89b3-d789b40ce83a'
    }
});
