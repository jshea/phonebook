
/*
 * Database is contacts
 * Collections are people, log
 * URL's are
 */
var express = require("express"),
   app = express(),
   MongoClient = require("mongodb").MongoClient,
   Server = require("mongodb").Server,
   ObjectID = require("mongodb").ObjectID;

// app.use(express.bodyParser());
app.configure(function () {
   app.use(express.methodOverride());  // Allows use of "put" & "del" methods?
   app.use(express.bodyParser());      // This clears out rec.body?
   app.use(express.static(__dirname + '/app'));
//   app.use(app.router);
});

var mongoclient = new MongoClient(new Server("localhost", 27017));
var db = mongoclient.db("contacts");


/*
 * Get all contacts
 */
app.get("/contacts", function (req, res) {
   db.collection("people").find().toArray(function (err, docs) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully retrieved all contacts: " + JSON.stringify(docs));
         res.send(docs);
      }
   });
});


/*
 * Get a contact
 */
app.get("/contacts/:id", function (req, res) {
   console.log("Get a contact: " + req.params.id);

   db.collection("people").findOne({"_id" : new ObjectID(req.params.id)}, function (err, doc) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully retrieved one contact: " + JSON.stringify(doc));
         res.send(doc);
      }
   });
});


/*
 * Add a contact.
 *
 * Note: Angular is calling this endpoint when doing a POST for update instead
 * of appending the :id at the end.
 */
app.post("/contacts", function (req, res) {

   var person = req.body;
   console.log("POST /contacts, req.body: " + JSON.stringify(person));

   // If there isn't a _id property then this is an add
   if (typeof person._id === "undefined") {
      db.collection("people").insert(person, function (err, result) {
         if (err) {
            throw err;
         } else {
            console.dir("Successfully inserted: " + JSON.stringify(result[0])); // Note the returned value (result) is an array even if it’s one document

            res.send(resultresult[0]);
         }
      });
   } else {
      // There was an _id so this is an update. Why do I have to use ObjectID()?
      var id = person._id; // Save id.
      delete person._id;   // Remove _id so mongo doesn't think we're trying to change it.
      // TODO Why? Docs say The operation does not replace the _id value?
      //    http://docs.mongodb.org/manual/reference/method/db.collection.update/#example-update-replace-fields
      db.collection("people").update({"_id" : new ObjectID(id)}, person, function (err, result) {
         if (err) {
            throw err;
         } else {
            console.dir("Successfully updated: " + JSON.stringify(result));

            db.collection("people").findOne({"_id" : person._id}, function (err, doc) {
               if (err) {
                  throw err;
               } else {
                  console.dir("Successfully retrieved one contact: " + JSON.stringify(doc));
                  res.send(doc);
               }
            });
         }
      });
   }


});


/*
 * Update a contact.
 * Angular seems to call without the :id on an update!?
 */
app.post("/contacts/:id", function (req, res) {
   console.log("Updating a contact");

   db.collection("people").save(req.body, function (err, saved) {
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
app.del("/contacts", function (req, res) {
   console.log("Deleting contact id", req.params.id);

   db.collection("people").remove({"_id" : req.params.id}, function (err, removed) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully removed " + removed + " documents!");
         res.send("Contact deleted", 200);
      }
   });
});


/*
 * Delete a contact
 */
app.del("/contacts/:id", function (req, res) {
   console.log("Deleting contact id", req.params.id);

   db.collection("people").remove({"_id" : req.params.id}, function (err, removed) {
      if (err) {
         throw err;
      } else {
         console.dir("Successfully removed " + removed + " documents!");
         res.send("Contact deleted", 200);
      }
   });
});


/*
 * For any undefined routes, return a 404.
 */
app.get("*", function (req, res) {
   console.log("A GET that wasn't found", req.params);
   res.send("Page Not Found", 404);
});
app.post("*", function (req, res) {
   console.log("A POST that wasn't found", req.params);
   res.send("Page Not Found", 404);
});
app.del("*", function (req, res) {
   console.log("A DELETE that wasn't found", req.params);
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
