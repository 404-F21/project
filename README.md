# Project - Social Distribution
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Team Members:

* drapeza
* kanishk
* wstix
* xingjie1
* ywu18

## Running Instructions:

* Make sure that you have `pipenv` and `pyenv` installed.
  * If not: run `python3 -m pip install pipenv pyenv`
  * Or follow: https://pipenv-fork.readthedocs.io/en/latest/install.html
    * Note: pyenv is not neccessary to install if python v3.8 is installed
* Clone the repo: `git clone https://github.com/404-F21/project.git`
* `cd project/`
* Establish the module requirements: `pipenv sync`
* Activate the virtual env: `pipenv shell`
* Migrate all the migrations: `python manage.py migrate`
* Navigate to `front_end/`, and run `npm ci` followed by `npm start`
* In another tty, run `python manage.py runserver` in the repository's root directory
  * OPTIONAL: Before running the server, create a local superuser to access the admin page - `python manage.py createsuperuser`

## Work Distribution:

### Part 1
* **xingjie1** and **ywu18** worked on the frontend aspect of the project.
* **kanishk** worked on designing the database (models.py) and the README.
* **drapeza** worked on the connecting the frontend with the database using a REST API.
* **wstix** worked on project setup, helped everyone out in combining their parts, GitHub management, and bugfixing.

## Design Principles:

### 1) Author
#### Keynotes - Database Implications:
* Can login/sign up - Store a unique identifier, personal info and password
* Make, like and comment on posts - store a list of said *posts*
* Upload images/profile pictures - store the image url to refer
* Can be from different host - store the host url

### 2) Friend Request
#### Keynotes - Database Implications:
* Can be one-sided (becomes a follow) - store if x follows y
* Can be two-sided (become a friend if accepted from both sides) - store if the
  x follows y and if y follow x separately and uniquely
* Is unique - store an identifier

### 3) Post
#### Keynotes - Database Implications:
* Is unique - store an identifier
* Can contain multiple content types - provide options for the type of content
* Can contain an image - store the uploaded image **and** the url
* Can contain comments/likes - store a list of comments/authors who have left a like
* Belongs to an author - store the author id

### 4) Comment
#### Keynotes - Database Implications:
* Belongs to an author - store the author id
* Belongs to a post - store the post id
* Is unique - store an identifier

### 5) Like
#### Keynotes - Database Implications:
* Can belong to a comment - store comment id
* Can belong to a post - store the post id
* Is unique but removable - store identifier

Copyright 2021 Kanishk Chawla, Nathan Drapeza, Xingjie He, Warren Stix, Yifan Wu

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
 	http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and limitations
under the License.
