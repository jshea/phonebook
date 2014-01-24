/*
 * This is run from the command line
 *    node MongoWS.js
 *
 * This is dependent on the following node modules
 *    mongodb
 *    express
 *    moment
 *
 * This accesses a MongoDB database. MongoDB (from "humongous") is a scalable, high-performance, open source
 * NoSQL database. http://mongodb.org/
 *
 * Resources used to create this program
 *    https://github.com/mongodb/node-mongodb-native
 *    https://github.com/christkv/node-mongodb-native
 *    https://github.com/christkv/NodeJS-mongodb-native/tree/master/docs
 *
 *    https://groups.google.com/forum/?fromgroups#!topic/NodeJS-mongodb-native/8qAsFsUTPMk%5B1-25%5D
 *    https://gist.github.com/444255
 */
"use strict";

var PB = PB   || {};		// Establish PB namespace if it doesn't already exist
PB.Db = PB.Db || {};		// Add "Db" to PB namespace, will be used for database functionality
PB.Db.mongo = require('mongodb');
PB.Db.conn = new PB.Db.mongo.Db('phonebook', new PB.Db.mongo.Server("localhost", 27017, {auto_reconnect: true, poolsize: 5}));

/*
 * JavaScript date library for parsing, validating, manipulating, and formatting dates
 *    http://momentjs.com/
 */
PB.moment = require('moment');

/*
 * ExpressJS is a web application framework for node
 *    http://expressjs.com/
 */
PB.express = require('express');
PB.app = PB.express();
PB.app.listen(8001);
PB.app.use(require('express').bodyParser());
// PB.app.set('jsonp callback', true);

/*
 * Note later examples I've seen including Christophe Coenrates use the following:
 *    var Server = mongo.Server,
 *       Db = mongo.Db,
 *       BSON = mongo.BSONPure;
 *
 *    db.collection('wines', function(err, collection) {
 *       collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
 *           res.send(item);
 *       });
 *   });
 *
 */
PB.Db.conn.open(function (err, db) {
	var ObjectID = db.bson_serializer.ObjectID;
	console.log("It's alive!");

	/**
	 * Get document count
	 */
	PB.app.get('/count/', function (req, res) {
		console.log("Inside get/count");
		var $this = this;
		db.collection('person', function (err, collection) {
			if (err) {
				console.log("Inside collection error");
				console.log(err);
			} else {
				collection.count(function (err, count) {
					if (err) {
						console.log("Inside collection count error");
						console.log(err);
					} else {
						console.log("Inside collection success - count is " + count);
						res.send(JSON.stringify(count));
					}
				});
			}
		});
	});


	/**
	 * Get all documents
	 */
	PB.app.get('/', function (req, res) {

		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {

				collection.find({}, {"sort": [["lastName", "asc"], ["firstName", "asc"]]}).toArray(function (err, documents) {
					if (err) {
						console.log(err);
					} else {
						if (documents === null) {
							res.send("{}");
						} else {
							res.send(documents);
						}
					}
				});
			}
		});
	});


	/**
	 * Get document by id
	 */
	PB.app.get('/:id', function (req, res) {
		var id = req.params.id;
		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {
				collection.findOne({_id: new ObjectID(id)}, function (err, document) {
					if (err) {
						console.log(err);
					} else {
						res.send(document);
					}
				});
			}
		});
	});


	/**
	 * Add a person
	 * Should we fail if document _id already exists?
	 */
	PB.app.post('/', function (req, res) {
		var person = {};
		if (req.body.firstName !== undefined && req.body.firstName !== "") { person.firstName = req.body.firstName; }
		if (req.body.lastName  !== undefined && req.body.lastName  !== "") { person.lastName  = req.body.lastName;  }
		if (req.body.address   !== undefined && req.body.address   !== "") { person.address   = req.body.address;   }
		if (req.body.city      !== undefined && req.body.city      !== "") { person.city      = req.body.city;      }
		if (req.body.state     !== undefined && req.body.state     !== "") { person.state     = req.body.state;     }
		if (req.body.zip       !== undefined && req.body.zip       !== "") { person.zip       = req.body.zip;       }
		if (req.body.mobile    !== undefined && req.body.mobile    !== "") { person.mobile    = req.body.mobile;    }
		if (req.body.home      !== undefined && req.body.home      !== "") { person.home      = req.body.home;      }
		if (req.body.work      !== undefined && req.body.work      !== "") { person.work      = req.body.work;      }
		if (req.body.email     !== undefined && req.body.email     !== "") { person.email     = req.body.email;     }
		if (req.body.birthday  !== undefined && req.body.birthday  !== "") { person.birthday  = req.body.birthday;  }
		if (req.body.children  !== undefined && req.body.children  !== "") { person.children  = req.body.children;  }

		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {
				collection.insert(person, {safe: true}, function (err, records) {
					if (err) {
						console.log(err);
						res.send(err);
					} else {
						console.log("Record added as " + records[0]._id);
						collection.find().toArray(function (err, documents) {
							if (err) {
								console.log(err);
							} else {
								if (documents === null) {
									res.send("{}");
								} else {
									res.send(documents);
								}
							}
						});
					}
				});
			}
		});
	});


	/**
	 * Update a document (person)
	 */
	PB.app.put('/', function (req, res) {
		var person = req.body;
		person._id = new ObjectID(person.id);

		console.log(person);

		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {
				collection.save(person, {safe: true}, function (err, recordCount) {
					if (err) {
						console.log(err);
					} else {
						console.log("Record updated");
						collection.find().toArray(function (err, documents) {
							if (err) {
								console.log(err);
							} else {
								if (documents === null) {
									res.send("{}");
								} else {
									res.send(documents);
								}
							}
						});
					}
				});
			}
		});
	});


	/**
	 * Search
	 */
	PB.app.post('/search/', function (req, res) {
		var searchElements = [], searchString = "";

		if (req.body.firstName !== undefined && req.body.firstName !== "") { searchElements.push('"firstName": "' + req.body.firstName + '"'); }
		if (req.body.lastName  !== undefined && req.body.lastName  !== "") { searchElements.push('"lastName": "'  + req.body.lastName  + '"'); }
		if (req.body.address   !== undefined && req.body.address   !== "") { searchElements.push('"address": "'   + req.body.address   + '"'); }
		if (req.body.city      !== undefined && req.body.city      !== "") { searchElements.push('"city": "'      + req.body.city      + '"'); }
		if (req.body.state     !== undefined && req.body.state     !== "") { searchElements.push('"state": "'     + req.body.state     + '"'); }
		if (req.body.zip       !== undefined && req.body.zip       !== "") { searchElements.push('"zip": "'       + req.body.zip       + '"'); }
		if (req.body.mobile    !== undefined && req.body.mobile    !== "") { searchElements.push('"mobile": "'    + req.body.mobile    + '"'); }
		if (req.body.home      !== undefined && req.body.home      !== "") { searchElements.push('"home": "'      + req.body.home      + '"'); }
		if (req.body.work      !== undefined && req.body.work      !== "") { searchElements.push('"work": "'      + req.body.work      + '"'); }
		if (req.body.email     !== undefined && req.body.email     !== "") { searchElements.push('"email": "'     + req.body.email     + '"'); }

		/* name - combination of firstname & lastname
		 * address - street, city, state, zip contain ...
		 * phone - mobile, home or work contain ...
		 */
		searchString = "{" + searchElements.join(", ") + "}";
		console.log(searchString);
		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {
				collection.find(JSON.parse(searchString)).toArray(function (err, documents) {
					if (err) {
						console.log(err);
					} else {
						res.send(documents);
					}
				});
			}
		});
	});


	/**
	 * Delete all
	 */
	PB.app.del('/deleteall/', function (req, res) {
		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {
				collection.remove(function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("deleted all documents");
						collection.find().toArray(function (err, documents) {
							if (err) {
								console.log(err);
							} else {
								if (documents === null) {
									res.send("{}");
								} else {
									res.send(documents);
								}
							}
						});
					}
				});
			}
		});
	});


	/**
	 * Delete a document (person)
	 * Note: delete is a JavaScript keyword. express has del() (and other) alias for the delete method
	 */
	PB.app.del('/:id', function (req, res) {
		var id = req.params.id;

		console.log("id to delete: " + id);

		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {
				collection.remove({_id: new ObjectID(id)}, function (err, recordCount) {
					if (err) {
						console.log(err);
						res.send("Deletion failed");
					} else {
						console.log("document removed - " + id);
						collection.find().toArray(function (err, documents) {
							if (err) {
								console.log(err);
							} else {
								if (documents === null) {
									res.send("{}");
								} else {
									res.send(documents);
								}
							}
						});
					}
				});
			}
		});
	});


	/**
	 * Reset the database. This deletes all data and loads the sample/test data
	 */
	PB.app.post('/reinitialize/', function (req, res) {

		db.collection('person', function (err, collection) {
			if (err) {
				console.log(err);
			} else {

				collection.remove(function (err) {
					if (err) {
						console.log(err);
						res.send(err);
					} else {

						console.log("deleted all documents");
						collection.insert(testData, {safe: true}, function (err, records) {
							if (err) {
								console.log(err);
								res.send(err);
							} else {

								console.log("Records added as " + records);
								collection.find().toArray(function (err, documents) {
									if (err) {
										console.log(err);
									} else {
										if (documents === null) {
											res.send("{}");
										} else {
											res.send(documents);
										}
									}
								});
							}
						});
					}
				});


			}
		});
	});

});



/**
 * This is dummy test data loaded when the objectstore is created. Objectstore creation
 * happens in request.onupgradeneeded
 *
 * @type {Array}
 */
var testData = [
	{
		"firstName":   "Fred",
		"lastName":    "Flintstone",
		"address":     "345 Cave Stone Rd",
		"city":        "Bedrock",
		"state":       "NA",
		"zip":         "123",
		"mobilePhone": "33",
		"homePhone":   "111",
		"workPhone":   "x",
		"email":       "Fred@Flintstone.com",
		"birthday":    "1970-01-01",
		"children":    "1"
	},
	{
		"firstName":   "Wilma",
		"lastName":    "Flintstone",
		"address":     "345 Cave Stone Rd",
		"city":        "Bedrock",
		"state":       "NA",
		"zip":         "123",
		"mobilePhone": "44",
		"homePhone":   "11",
		"workPhone":   "x",
		"email":       "Wilma@Flintstone.com",
		"birthday":    "1971-01-01",
		"children":    "1"
	},
	{
		"firstName":   "Barney",
		"lastName":    "Rubble",
		"address":     "123 Granite Way",
		"city":        "Bedrock",
		"state":       "NA",
		"zip":         "123",
		"mobilePhone": "55",
		"homePhone":   "22",
		"workPhone":   "x",
		"email":       "Barney@Rubble.com",
		"birthday":    "1972-01-01",
		"children":    "1"
	},
	{
		"firstName":   "Betty",
		"lastName":    "Rubble",
		"address":     "123 Granite Way",
		"city":        "Bedrock",
		"state":       "NA",
		"zip":         "123",
		"mobilePhone": "66",
		"homePhone":   "22",
		"workPhone":   "x",
		"email":       "Betty@Rubble.com",
		"birthday":    "1973-01-01",
		"children":    "1"
	}
];