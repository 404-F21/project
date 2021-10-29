# Project - Social Distribution

## Team Members:

* drapeza
* kanishk
* wstix
* xingjie1
* ywu18

## Running Instructions:

* Make sure that you have `pipenv` and `pyenv` installed.
  * if not: do `python -m pip install pipenv pyenv`
  * Or follow: https://pipenv-fork.readthedocs.io/en/latest/install.html
    * Note: pyenv is not needed to be installed if python v3.8 is installed
* Clone the repo: `git clone https://github.com/404-F21/project.git`
* `cd project/`
* Establish the module requirements: `pipenv sync`
* Activate the virtual env: `pipenv shell`
* Migrate all the migrations: `python manage.py migrate`
* `cd front_end/`, run `npm ci` and `npm start`
* In another terminal, do `python manage.py runserver` in root directory
  * OPTIONAL: Before running the server, create a local super user to access admin page - `python manage.py createsuperuser`

## Work Distribution:

### Part 1
* **xingjie1** and **ywu18** worked on the front end part of the project.
* **kanishk** worked on designing the database(models.py) and README.
* **drapeza** worked on the connecting the front end with the database using API.
* **wstix** worked on project setup, helped everyone out in combining their parts and bug fixing.

## Design Principles:

### 1) Author
#### Keynotes - Database implcations:
* Can login/sign up - Store a unique identifier, personal info and password
* Make, like and comment on posts - Store a list of said *posts*
* Upload images/profile pictures - Store the image url to refer
* Can be from different host - Store the host url

### 2) Friend Request
#### Keynotes - Database implcations:
* Can be on sided (becomes a follow) - Store if x follows y
* Can be both sided (become a friend if accepted from both sides) - Store if the x follows y and if y follow x separately and uniquely
* is unique - store identifier

### 3) Post
#### Keynotes - Database implcations:
* Is unique - Store an identifier
* Can contain multiple content type - Provide options for the type of content
* Can contain an image - Store the uploaded image **and** the url
* Can contain comments/likes - Store a list of comments/authors who like
* Belongs to an author - Store the author id

### 4) Comment
#### Keynotes - Database implcations:
* Belongs to an author - Store the author id
* Belongs to a post - Store the post id
* is Unique - Store identifier

### 5) Like
#### Keynotes - Database implcations:
* Can belong to a comment - Store comment id
* Can belong to a post - Store the post id
* is Unique but removable - Store identifier
