# Capstone-SDI28-SupraDev
Problem Statement: There is currently no formal site used to request application creation/developmental services from Supra Coders, or other entities within the USSF.

# Project Name

SupraDev App - Capstone

## Description

A database, Backend and Frontend application for Supra Coder project creation and a repository for all previously created applications.

## Prerequisites

The prerequisites that users need to have installed or set up before they can use your project.

- Docker (https://www.docker.com/)
- VSCode (https://code.visualstudio.com/)
- Google Browser
- GitHub access/access to the internet

## Getting Started

- Clone this repository by running:
  (git clone git@github.com:JrSant17/Capstone-SDI28-SupraDev.git)
- Change directories to this git file by running:
  (cd Capstone-SDI28-SupraDev)
- To access this repository in VSCode run:
  (code .) from the Capstone-SDI28-SupraDev file path
- Open your terminal within VSCode by pressing:
  (control/command+shift+J)
- Change directories to the backend by running:
  (cd api)
- Install all backend dependencies by running:
  (npm install)
- Ensure Docker is running on your machine by running:
  (docker --version)
  [if it isn't running, install the latest version of docker before moving forward with running this application]
- Once you have docker running, stop any containers named postgres in order to start a new container with the correct tags and ports. Run the following below to open the postgres database in a new container once it is confirmed there are no other containers named postgres running:
  (docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres)
- Confirm a new container is started by running:
  (docker ps -a)
- Now we need to create a database to migrate and seed our API tables into it. Run:
  (docker exec -it [ContainerID] bash) then (psql -U postgres) then (CREATE DATABASE supradb;)
- Spin up a new VSCode terminal by pressing the '+' button at the top right of your current VSCode terminal, then change directories back to API:
  (cd api)
- Migrate and Seed the tables into your new supradb database:
  (npx knex migrate:latest) then (npx knex seed:run)
- Now you can access the database in a new terminal by running:
  (npm start)

- Now open up another new terminal for the frontend by pressing the + button
- Change directories to the frontend by running:
  (cd ui)
- Install all frontend dependencies by running:
  (npm install)
- Start the application by running:
  (npm start)
- Open the app and test it by opening the browser to:
  (http://localhost:3000)


## Troubleshooting

- if you receive an error in regards to the postgres version number when attempting to run a new container image, specify the needed version number in the docker run command:
  For example, if you get the error:
  "PostgreSQL Database directory appears to contain a database; Skipping initialization

  2023-09-18 20:50:28.026 UTC [1] FATAL:  database files are incompatible with server
  2023-09-18 20:50:28.026 UTC [1] DETAIL:  The data directory was initialized by PostgreSQL version 15, which is not compatible with this version 16.0 (Debian 16.0-1.pgdg120+1)."
  Run:
  (docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql@15/data postgres) note the '@15' which specifies the version of postgres in the docker file path.

## Testing

For the backend API it primarily runs tests with a test database:
```
supradb_test
```
Under /api/test there are two shell scripts that are "in-progresss" to connect to an existing pg-docker container and create and destroy the database before and after the test. TBD.
Currently, you need to have a running pg-docker container and can run the script yourself for creation and deletion:
####  Create test DB
```
sudo bash ./test/supradb_test_create.sh supradb_test pg-docker
```

#### Delete test DB
```
sudo bash ./test/supradb_test_destroy.sh supradb_test pg-docker
```
but it won't execute from the node test itself.

We recommend you run the creation script and then leave it alone. Afterwords the routes.test.js jest file will take care of migrations, seeding between test runs.

## Updates from SDI-18

1. Added the ability for multiple supracoder to be associated with a project and work collaboratively
2. Added project state, in the form of milestones, to projects
3. Updated the homepage to show an overview of project states, or news if the user isn't logged in
4. Account creation now allows for multiple users, fro, normal, supra, leader, or admin level users.
5. User profile pages have more details
6. Updated project submission page
7. 