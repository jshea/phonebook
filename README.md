phonebook-angular
=================

Phonebook/Contact Manager learning example with AngularJS, NodeJS and MongoDB

# NodeJS files

These are NodeJS REST Web Services to provide the server side data.

### server.js
A [NodeJS](http://nodejs.org/)/[ExpressJS](http://expressjs.com/) REST Web Service
that maintains data in [MongoDB](http://mongodb.org).

## Installing MongoDB and NodeJS

### MongoDB
Download latest stable version from http://mongodb.org/
````
create an application folder: \mongo
expand the contents of the downloaded \bin folder into \mongo
````
Create a data directory for MongoDB. Example `\mongodata`. MongoDB will
create the database and collection automatically at runtime if they don't already
exist. Databases and Collections don't have to be created in a separate step.


### Node.js

Install the latest stable version from http://nodejs.org/

Install modules required for MongoDB driver, RESTful Web Services and date/time parsing.

At the commandline run
````
npm install -g express
npm install -g mongodb
npm install -g moment
````

## Running MongoDB and NodeJS

Start the database server
````
"\mongo\mongod" --dbpath=\mongodata
````

Start the Web Service after starting the database
````
"node" \YOUR PATH TO THE APPLICATION\server.js
````
