
/*
 * Database is contacts
 * Collections are people, log
 * URL's are
 */
var express = require("express"),
   app = express(),
   MongoClient = require("mongodb").MongoClient,
   Server = require("mongodb").Server;


var mongoclient = new MongoClient(new Server("localhost", 27017));
var db = mongoclient.db("contacts");


/*
 * Get all contacts
 */
app.get("/contacts", function (req, res) {
   db.collection("people").find({}, function (err, doc) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully retrieved all contacts");
         res.send(doc);
      }
   });
});


/*
 * Get a contact
 */
app.get("/contacts/:id", function (req, res) {
   db.collection("people").findOne({"id" : req.params.id}, function (err, doc) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully retrieved one contact: " + JSON.stringify(doc));
         res.send(doc);
      }
   });
});


/*
 * Add a contact
 */
app.post('/contacts', function (req, res) {
   console.log('Adding a contact');

   // Note the returned value (inserted) is an array even if it's one document
   db.collection("students").insert(req.params, function (err, inserted) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully inserted: " + JSON.stringify(inserted));
         res.send(inserted);
      }
   });

});


/*
 * Update a contact
 */
app.post('/contacts/:id', function (req, res) {
   console.log('Updating a contact');

   db.collection("grades").save(req.params, function (err, saved) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully updated: " + JSON.stringify(saved));
         res.send(saved);
      }
   });

});


/*
 * Delete a contact
 */
app.del('/contacts/:id', function (req, res) {
   console.log('Deleting contact id', req.params.id);

   db.collection("grades").remove({"_id" : req.params.id}, function (err, removed) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully updated " + removed + " documents!");
         res.send("Contact deleted", 200);
      }
   });
});


/*
 * For any undefined route, return a 404.
 */
app.get("*", function (req, res) {
   res.send("Page Not Found", 404);
});
app.post("*", function (req, res) {
   res.send("Page Not Found", 404);
});


/*
 * Fire up the server and start listening!
 */
mongoclient.open(function (err, mongoclient) {
   if (err) { throw err; }

   app.listen(3000, function () {
      console.log("Express server started on port 3000");
   });
});

/*
// Find
var query = { "grade" : 100 };

db.collection("grades").find(query).toArray(function(err, docs) {
   if (err) { throw err; }
   console.dir(docs);
});

db.collection("grades").find(query).each(function(err, docs) {
   if (err) { throw err; }
   console.dir(docs);
});



// FindOne
var query = { "grade" : 100 };

db.collection("grades").findOne(query, function(err, doc) {
   if (err) { throw err; }
   console.dir(doc);
});

// FindAndModify
var query = { "name" : "comments" };
var sort = [];
var operator = { "$inc" : { "counter" : 1 } };
var options = { "new" : true };

db.collection("counters").findAndModify(query, sort, operator, options, function(err, doc) {
   if (err) { throw err; }

   if (!doc) {
      console.log("No counter found for comments.");
   }
   else {
      console.log("Number of comments: " + doc.counter);
   }
});


// Insert
// Note the returned value (inserted) is an array even if it's one document
var doc = { "_id" : "calvin", "age" : 6 };

db.collection("students").insert(doc, function(err, inserted) {
    if (err) { throw err; }
    console.dir("Successfully inserted: " + JSON.stringify(inserted));
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
      console.dir("Successfully saved " + saved + " document!");
      return saved;
   });
});


// Update
query["_id"] = doc["_id"];
doc["date_returned"] = new Date();

db.collection("grades").update(query, doc, function(err, updated) {
   if (err) { throw err; }
   console.dir("Successfully updated " + updated + " document!");
});

 // Multi update
var query = { };
var operator = { "$unset" : { "date_returned" : "" } };
var options = { "multi" : true };

db.collection("grades").update(query, operator, options, function(err, updated) {
   if (err) { throw err; }
   console.dir("Successfully updated " + updated + " documents!");
});

 // Upsert
// Data will be inserted if a matching document isn't found
var query = { "student" : "Frank", "assignment" : "hw1" };
//var operator = { "student" : "Frank", "assignment" : "hw1", "grade" : 100 };
var operator = { "$set" : { "date_returned" : new Date(), "grade" : 100 } };
var options = { "upsert" : true };

db.collection("grades").update(query, operator, options, function(err, upserted) {
    if (err) { throw err; }
    console.dir("Successfully upserted " + upserted + " document!");
});

 // Remove
var query = { "assignment" : "hw3" };

db.collection("grades").remove(query, function(err, removed) {
   if (err) { throw err; }
   console.dir("Successfully updated " + removed + " documents!");
});

*/
