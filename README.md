# O'Reilly Katacoda Software Engineer Coding Exercise

The exercise is a small project for you to complete that looks like a small
task you might do at O'Reilly. There is no online coding environment or other
restriction on how to work — you complete the entire exercise on your device.
Use libraries, your favorite IDE and debugger, and whatever else you would use
while coding normally.

- We respect all of our candidates' time, so we've structured this exercise to
  take about 2-3 hours. We encourage candidates to leave comments or
  descriptions on additional changes or improvements they would make with more
  time or if they were to continue working on the exercise.
- It's OK to use any coding environment, Stack Overflow, or whatever else you
  would use when you're coding normally.
- It is **not** OK to copy code verbatim or consult a friend.
- We're looking for simplicity, clarity and code readability over cleverness or
  flexibility.
- We ask you not share the details of this project with others.
- When you've completed your exercise, create a PR into `main` with your
  changes.

## The Exercise

You will be building a micro-service that provides a RESTful API for launching
*Docker* containers.  You may choose either *Node.js* with
[Express](https://expressjs.com/) or *Python* with
[Django](https://www.djangoproject.com/) and
[Django-REST-framework](https://www.django-rest-framework.org/) to implement
the service. The service should use the *Docker* api to manage the containers.
You can use an established library such as
[docker-py](https://docker-py.readthedocs.io/en/stable/) or
[dockerode](https://github.com/apocas/dockerode). You'll probably need to have
*Docker* running locally.

The service should maintain a list of vetted docker images from [Docker
Hub](https://hub.docker.com/) in a database. While *PostgreSQL* is our preferred
database, we recommend that for this exercise you use *SQLite* to keep things
simple.  The following list of public images is a good place to start.

* [python](https://hub.docker.com/_/python)
* [node](https://hub.docker.com/_/node)

The service should provide an API that looks like the following. All responses
and requests should use a content type of `application/json`. The required
request and response parameters are left up to the implementing engineer.
**You should write automated tests to ensure that the APIs are working as
expected.**

### Images

* List all images: `GET /api/image/`
* Add a new image: `POST /api/image/`
* Get details about an image: `GET /api/image/{identifier}/`
* Delete an image: `DELETE /api/image/{identifier}/`


### Containers

* List running containers: `GET /api/container/`
* Launch a container: `POST /api/container/`
    * The service should refuse to fulfill requests that specify unvetted images.
* Get details about a container: `GET /api/container/{identifier}/`
    * This is basically the data returned when running `docker ps` from a shell.
* Terminate a running container: `DELETE /api/container/{identifier}/`


## Extra Credit Tasks

* Provide a `Dockerfile` and `docker-compose.yml` file
* Implement 100% test coverage
* Show off some of your skills in the language you didn't choose
