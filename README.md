phonebook-angular
=================

Phonebook/Contact Manager learning example with AngularJS, NodeJS and MongoDB

# NodeJS files

These are NodeJS REST Web Services to provide the server side data.

### server.js
A [NodeJS](http://nodejs.org/)/[ExpressJS](http://expressjs.com/) REST Web Service
that maintains data in memory. There is no persistence.

## Installing MongoDB and NodeJS

See the instructions in doc\InstallationAndConfiguration.md

## Running MongoDB and NodeJS

Start the database server
````
"\Program Files\mongodb\bin\mongod" --dbpath=\Users\USERNAME\mongodata
````

Start the Web Service
````
"\Program Files\nodejs\node" \Users\USERNAME\web\phonebook\NodeJS\MongoWS.js
````
