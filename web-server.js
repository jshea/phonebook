var express = require("express"),
   app = express(),
   port = parseInt(process.env.PORT, 10) || 3000;

app.configure(function () {
   app.use(express.methodOverride());
   app.use(express.bodyParser());
   app.use(express.static(__dirname + '/app'));
   app.use(app.router);
});

var contacts_map = {
   '1': {
      "id": "1",
      "firstname": "Jim",
      "lastname": "Shea",
      "address": {
         "street": "3110 San Juan Dr",
         "city": "Fullerton",
         "state": "CA",
         "zip": "92835"
      },
      "birthday": "8/21/1960",
      "spouse": "Loretta",
      "children": [
         { "sex": "Male",   "name": "Trevor" },
         { "sex": "Female", "name": "Elizabeth" }
      ],
      "phonenumbers": [
         { "type": "Mobile", "number": "7144586004" },
         { "type": "Home",   "number": "7145257476" },
         { "type": "Work",   "number": "8183547751" }
      ],
      "email": [
         { "type": "Home",   "account": "jimtshea@gmail.com" },
         { "type": "Work",   "account": "jshea@jpl.nasa.gov" }
      ]
   },
   '2': {
      "id": 2,
      "firstname": "Loretta",
      "lastname":  "Shea",
      "street":    "3110 San Juan Dr",
      "city":      "Fullerton",
      "state":     "CA",
      "zip":       "92835",
      "phonenumbers": [
         { "type": "Mobile", "number": "7145150270" }
      ]
   }
};
var next_id = 3;


// Get all contacts
app.get('/contacts', function (req, res) {
   console.log('Requesting all contacts');

   var contacts = [];

   for (var key in contacts_map) {
      contacts.push(contacts_map[key]);
   }

   res.send(contacts);
});


// Return one contact
app.get('/contacts/:id', function (req, res) {
   console.log('Requesting contact id', req.params.id);
   res.send(contacts_map[req.params.id]);
});


// Add
app.post('/contacts', function (req, res) {
   console.log('Adding a contact');

   var contact = {};
   contact.id = next_id++;
   contact.firstname    = req.body.firstname;
   contact.lastname     = req.body.lastname;
   contact.address      = req.body.address;
   contact.phonenumbers = req.body.phonenumbers;
   contact.email        = req.body.email;
   contact.birthday     = req.body.birthday;
   contact.spouse       = req.body.spouse;
   contact.children     = req.body.children;

   contacts_map[contact.id] = contact;

   res.send(contact);
});


// Update
app.post('/contacts/:id', function (req, res) {
   console.log('Updating contact id', req.params.id);

   var contact = {};
   contact.firstname    = req.body.firstname;
   contact.lastname     = req.body.lastname;
   contact.address      = req.body.address;
   contact.phonenumbers = req.body.phonenumbers;
   contact.email        = req.body.email;
   contact.birthday     = req.body.birthday;
   contact.spouse       = req.body.spouse;
   contact.children     = req.body.children;

   contacts_map[contact.id] = contact;

   res.send(contact);
});


// Delete
app.del('/contacts/:id', function (req, res) {
   console.log('Deleting contact id', req.params.id);

   delete contacts_map[req.params.id];

   var contacts = [];

   for (var key in contacts_map) {
      contacts.push(contacts_map[key]);
   }

   res.send(contacts);
});


// Start listing on port "port"
app.listen(port);
console.log('Now serving the app at http://localhost:' + port + '/');
