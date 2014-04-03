
"use strict";

/*
 * Database is contacts
 * Collections are people, log
 *
 * URL's are
 *   GET    /contacts      Get all contacts
 *   GET    /contacts/:id  Get one person by _id
 *   POST   /contacts      Add
 *   POST   /contacts/:id  Update
 *   DELETE /contacts/:id  Delete a contact
 *   DELETE /contacts      Delete all contacts
 *   POST   /flintstones   Reset data to the Flintstones
 *   POST   /reinitialize  Reset data to 10,000 generated people
 *
 */
var express = require("express"),
   app = express(),
   MongoClient = require("mongodb").MongoClient,
   Server = require("mongodb").Server,
   ObjectID = require("mongodb").ObjectID;      // Used to create Mongo ObjectID's from string representations of _id

// app.use(express.bodyParser());
app.configure(function () {
   app.set('port', process.env.PORT || 3000);   // If we're running in Heroku, the port will be assigned
   app.use(express.methodOverride());           // Allows use of "put" & "del" methods?
   app.use(express.bodyParser());               // This clears out rec.body?
   app.use(express.static(__dirname + '/app')); // Serve static files from the "app" subfolder
});

// var mongoclient = new MongoClient(new Server("localhost", 27017));  // Connect to Mongo on the local host, default port
var mongoclient = new MongoClient(new Server("mongodb://heroku:b575b02d54d4571297827cb51c6905e0@oceanic.mongohq.com:10067/app23707720"));  // Connect to Mongo on mongohq
var db = mongoclient.db("contacts");                                // Create a handle to the contacts database


/*
 * Get contacts info for a picklist. This is a subset of the data fields.
 *
 */
app.get("/contactpicklist", function (req, res) {
   db.collection("people").find({}, {fields: {"lastname": 1, "firstname": 1, "phonenumbers": 1}, "sort": {"lastname": 1, "firstname": 1}}).toArray(function (err, docs) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully retrieved all contacts: " + JSON.stringify(docs));
         res.send(docs);
      }
   });
});


/*
 * Get all contacts
 *
 */
app.get("/contacts", function (req, res) {
   db.collection("people").find({}, {sort: {lastname: 1, firstname: 1}}).toArray(function (err, docs) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully retrieved all contacts: " + JSON.stringify(docs));
         res.send(docs);
      }
   });
});


/*
 * Get a contact
 */
app.get("/contacts/:id", function (req, res) {
   // console.log("Get a contact: " + req.params.id);

   db.collection("people").findOne({"_id" : new ObjectID(req.params.id)}, function (err, doc) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully retrieved one contact: " + JSON.stringify(doc));
         res.send(doc);
      }
   });
});


/*
 * Add a contact.
 *
 */
app.post("/contacts", function (req, res) {

   var person = req.body;
   // console.log("PUT /contacts, req.body: " + JSON.stringify(person));

   db.collection("people").insert(person, function (err, result) {      // insert takes an object or array of objects
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully inserted: " + JSON.stringify(result[0])); // Note the returned value (result) is an array even if it’s one document

         res.send(result[0]);
      }
   });

});


/*
 * Update a contact
 */
app.post("/contacts/:id", function (req, res) {
   // console.log("Updating a contact");

   var person = req.body;
   person._id = new ObjectID(person._id);   // Convert _id to a mongo ObjectID

   db.collection("people").update({"_id" : person._id}, person, function (err, result) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully updated: " + JSON.stringify(result));

         db.collection("people").findOne({"_id" : person._id}, function (err, doc) {
            if (err) {
               throw err;
            } else {
               // console.dir("Successfully retrieved one contact: " + JSON.stringify(doc));
               res.send(doc);
            }
         });
      }
   });

});


/*
 * Delete a contact
 */
app.del("/contacts/:id", function (req, res) {
   // console.log("Deleting contact id", req.params.id);

   db.collection("people").remove({"_id" : new ObjectID(req.params.id)}, function (err, removed) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully removed " + removed + " documents!");
         res.send("Contact deleted", 200);
      }
   });
});


/*
 * Delete all contacts
 */
app.del("/contacts", function (req, res) {
   // console.log("Deleting contact id", req.params.id);

   db.collection("people").remove({}, function (err, removed) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully removed " + removed + " documents!");
         res.send("Contact deleted", 200);
      }
   });
});


// End of CRUD


/*
 * Get a count by state of all contacts
 * db.people.aggregate([{$group: {_id: "$address.state", count: {$sum: 1}} }, {$sort: {_id: 1}} ])
 */
app.get("/metrics/state", function (req, res) {
   db.collection("people").aggregate([{$group: {_id: "$address.state", count: {$sum: 1}} }, {$sort: {_id: 1}} ], function (err, docs) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully retrieved all contacts: " + JSON.stringify(docs));
         res.send(docs);
      }
   });
});


/**
 * Reset the database. This deletes all data and loads the sample/test data
 */
app.post("/flintstones", function (req, res) {

   db.collection("people").remove(function (err, removed) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully removed " + removed + " documents!");

         db.collection("people").insert(testData, function (err, result) {      // insert takes an object or array of objects
            if (err) {
               throw err;
            } else {
               // console.dir("Successfully inserted: " + JSON.stringify(result.length) + " documents"); // Note the returned value (result) is an array even if it’s one document

               res.send(result);
            }
         });
      }
   });

});


/**
 * Reset the database. This deletes all data and loads the sample/test data
 */
app.post("/reinitialize", function (req, res) {
   var newPeople = [],
      i;

   for (i = 1; i <= 10000; i++) {
      newPeople.push(createPerson());
   }

   db.collection("people").remove(function (err, removed) {
      if (err) {
         throw err;
      } else {
         // console.dir("Successfully removed " + removed + " documents!");

         db.collection("people").insert(newPeople, function (err, result) {      // insert takes an object or array of objects
            if (err) {
               throw err;
            } else {
               // console.dir("Successfully inserted: " + JSON.stringify(result.length) + " documents"); // Note the returned value (result) is an array even if it’s one document

               res.send({result: "success"});
            }
         });
      }
   });

});

/*
 * For any undefined routes, return a 404.
 */
app.get("*", function (req, res) {
   // console.log("A GET that wasn't found", req.params);
   res.send("Page Not Found", 404);
});
app.post("*", function (req, res) {
   // console.log("A POST that wasn't found", req.params);
   res.send("Page Not Found", 404);
});
app.put("*", function (req, res) {
   // console.log("A PUT that wasn't found", req.params);
   res.send("Page Not Found", 404);
});
app.del("*", function (req, res) {
   // console.log("A DELETE that wasn't found", req.params);
   res.send("Page Not Found", 404);
});


/*
 * Fire up the server and start listening!
 */
mongoclient.open(function (err, mongoclient) {
   if (err) { throw err; }

   app.listen(app.get('port'), function () {
      console.log("Express server started on port 3000");
   });
});

// Load data for creating test data/dummey people objects
var firstName      = require('./data/firstname.json'),
   lastName        = require('./data/lastname.json'),
   zipStateCity    = require('./data/zipstatecity.json'),
   streetExtension = require('./data/streetextension.json'),
   streetName      = require('./data/streetname.json'),
   eMail           = require('./data/email.json');


/*   Utilities   */


/*
 * This version uses a passed in String. This isn't tested!
 */
function toProperCase(string) {
   if (string !== undefined) {
      return string.replace(/\w\S*/g, function (txt) {
         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
   } else {
      return "";
   }
}


/*
 * Generate an area code. Here an Area Code is a three digit number. There
 * are some rules for real area codes that are not honored here.
 */
function generateAreaCode() {
   // Must be 3 digits, so 100 - 999 are valid values
   var areaCode = getRandomNumber(101, 999);
   return areaCode.toString();
}


/*
 * Generate a phone number. Here it's defined as a 7 digit number. There
 * are some rules for real phone numbers that are not honored here.
 */
function generatePhoneNumber() {
   return getRandomNumber(1234567, 9999999); // lowerBound is a dummy min val for a phone number
}

/*
 * Generate a random number who's value is between lowerBound and upperBound
 */
function getRandomNumber(lowerBound, upperBound) {
   // http://www.maconstateit.net/Tutorials/JavaScript/JS02/jsdhtml02-04.php
   return Math.floor((upperBound - lowerBound + 1) * Math.random()) + lowerBound;
}

/*
 * Create a dummy person object with randomly selected data values for each
 */
function createPerson() {
   var zipStateCityElements,
      areaCode,
      p = {};

   areaCode = generateAreaCode();

   p.firstname = toProperCase(firstName[getRandomNumber(1, firstName.length - 1)]);
   p.lastname =  toProperCase(lastName[getRandomNumber(1, lastName.length - 1)]);

   zipStateCityElements = zipStateCity[getRandomNumber(1, zipStateCity.length - 1)];
   p.address = {};
   p.address.street =
      getRandomNumber(1, 9999) + " " +
      toProperCase(streetName[getRandomNumber(1, streetName.length - 1)]) + " " +
      toProperCase(streetExtension[getRandomNumber(1, streetExtension.length - 1)]);
   p.address.city = toProperCase(zipStateCityElements[2]);
   p.address.state = zipStateCityElements[1];
   p.address.zip = zipStateCityElements[0];

   p.phonenumbers = [
      {"type": "mobile", number: areaCode + generatePhoneNumber() },
      {"type": "home",   number: areaCode + generatePhoneNumber() },
      {"type": "work",   number: areaCode + generatePhoneNumber() }
   ];

   p.email = [
      { type: "personal",
         account: p.firstname.toLowerCase() + "." + p.lastname.toLowerCase() + "@" + eMail[getRandomNumber(1, eMail.length)]}
   ];

   p.birthday = new Date(getRandomNumber(1, new Date().getTime()));

// console.log(JSON.stringify(p));

   return p;
}


/**
 * This is dummy test data for the /flintstones endpoint
 *
 * @type {Array}
 */
var testData = [
   {
      "firstname": "Fred",
      "lastname":  "Flintstone",
      "address": {
         "street": "345 Cave Stone Rd",
         "city":   "Bedrock",
         "state":  "NA",
         "zip":    "123"
      },
      "phonenumbers": [
         {
            "type":   "mobile",
            "number": "111"
         }
      ],
      "email": [
         {
            "type":    "personal",
            "account": "Fred@Flintstone.com"
         }
      ],
      "birthday":  "1970-01-01",
      "spouse":    "Wilma",
      "children": [
         {
            "sex":  "girl",
            "name": "Pebbles"
         }
      ]
   },

   {
      "firstname":   "Wilma",
      "lastname":    "Flintstone",
      "address": {
         "street": "345 Cave Stone Rd",
         "city":   "Bedrock",
         "state":  "NA",
         "zip":    "123"
      },
      "phonenumbers": [
         {
            "type":   "mobile",
            "number": "222"
         }
      ],
      "email": [
         {
            "type":    "personal",
            "account": "Wilma@Flintstone.com"
         }
      ],
      "birthday":  "1970-02-01",
      "spouse":    "Fred",
      "children": [
         {
            "sex":  "girl",
            "name": "Pebbles"
         }
      ]
   },

   {
      "firstname":   "Barney",
      "lastname":    "Rubble",
      "address": {
         "street": "123 Granite Way",
         "city":        "Bedrock",
         "state":       "NA",
         "zip":         "123"
      },
      "phonenumbers": [
         {
            "type":   "work",
            "number": "333"
         }
      ],
      "email": [
         {
            "type":    "personal",
            "account": "Barney@Rubble.com"
         }
      ],
      "birthday":  "1970-03-01",
      "spouse":    "Betty",
      "children": [
         {
            "sex":  "boy",
            "name": "Bam Bam"
         }
      ]
   },

   {
      "firstname":   "Betty",
      "lastname":    "Rubble",
      "address": {
         "street": "123 Granite Way",
         "city":        "Bedrock",
         "state":       "NA",
         "zip":         "123"
      },
      "phonenumbers": [
         {
            "type":   "work",
            "number": "333"
         }
      ],
      "email": [
         {
            "type":    "personal",
            "account": "Betty@Rubble.com"
         }
      ],
      "birthday":  "1970-04-01",
      "spouse":    "Barney",
      "children": [
         {
            "sex":  "boy",
            "name": "Bam Bam"
         }
      ]
   }
];


/*
// Find
var query = { "grade" : 100 };

db.collection("grades").find(query).toArray(function(err, docs) {
   if (err) { throw err; }
   // console.dir(docs);
});

db.collection("grades").find(query).each(function(err, docs) {
   if (err) { throw err; }
   // console.dir(docs);
});



// FindOne
var query = { "grade" : 100 };

db.collection("grades").findOne(query, function(err, doc) {
   if (err) { throw err; }
   // console.dir(doc);
});

// FindAndModify
var query = { "name" : "comments" };
var sort = [];
var operator = { "$inc" : { "counter" : 1 } };
var options = { "new" : true };

db.collection("counters").findAndModify(query, sort, operator, options, function(err, doc) {
   if (err) { throw err; }

   if (!doc) {
      // console.log("No counter found for comments.");
   }
   else {
      // console.log("Number of comments: " + doc.counter);
   }
});


// Insert
// Note the returned value (inserted) is an array even if it's one document
var doc = { "_id" : "calvin", "age" : 6 };

db.collection("students").insert(doc, function(err, inserted) {
    if (err) { throw err; }
    // console.dir("Successfully inserted: " + JSON.stringify(inserted));
});


// Save
// If doc doesn't exist (defined as not having a _id field) it will be inserted.
// If it does exist (has _id) an update will be performed

var query = { "assignment" : "hw2" };

db.collection("grades").findOne(query, function(err, doc) {
   if (err) { throw err; }

   doc["date_returned"] = new Date();

   db.collection("grades").save(doc, function(err, saved) {
      if (err) { throw err; }
      // console.dir("Successfully saved " + saved + " document!");
      return saved;
   });
});


// Update
query["_id"] = doc["_id"];
doc["date_returned"] = new Date();

db.collection("grades").update(query, doc, function(err, updated) {
   if (err) { throw err; }
   // console.dir("Successfully updated " + updated + " document!");
});

 // Multi update
var query = { };
var operator = { "$unset" : { "date_returned" : "" } };
var options = { "multi" : true };

db.collection("grades").update(query, operator, options, function(err, updated) {
   if (err) { throw err; }
   // console.dir("Successfully updated " + updated + " documents!");
});

 // Upsert
// Data will be inserted if a matching document isn't found
var query = { "student" : "Frank", "assignment" : "hw1" };
//var operator = { "student" : "Frank", "assignment" : "hw1", "grade" : 100 };
var operator = { "$set" : { "date_returned" : new Date(), "grade" : 100 } };
var options = { "upsert" : true };

db.collection("grades").update(query, operator, options, function(err, upserted) {
    if (err) { throw err; }
    // console.dir("Successfully upserted " + upserted + " document!");
});

 // Remove
var query = { "assignment" : "hw3" };

db.collection("grades").remove(query, function(err, removed) {
   if (err) { throw err; }
   // console.dir("Successfully updated " + removed + " documents!");
});

*/
