"use strict";

/**
 *   These functions are called when the application is off-line.
 */
app.factory('forageFactory', function (localForageAppId) {
   /**
    * This is dummy test data loaded when the program starts up offline.
    *
    * @type {Array}
    */
   var testData = [
      {
         "firstName":   "Fred",
         "lastName":    "Flintstone",
         "address": {
            street: "345 Cave Stone Rd",
            "city": "Bedrock",
            "state": "NA",
            "zip": "123"
         },
         phonenumbers: [
            {"type": "mobile", number: "111" },
            {"type": "home",   number: "222" },
            {"type": "work",   number: "333" }
         ],
         "email": [
            { "type": "personal", "account": "Fred@Flintstone.com" }
         ],
         "birthday":    "1970-01-01",
         "children":    "1"
      },
      {
         "firstName":   "Wilma",
         "lastName":    "Flintstone",
         "address": {
            street: "345 Cave Stone Rd",
            "city": "Bedrock",
            "state": "NA",
            "zip": "123"
         },
         phonenumbers: [
            {"type": "mobile", number: "444" },
            {"type": "home",   number: "555" },
            {"type": "work",   number: "666" }
         ],
         "email": [
            { "type": "personal", "account": "Wilma@Flintstone.com" }
         ],
         "birthday":    "1971-01-01",
         "children":    "1"
      },
      {
         "firstName":   "Barney",
         "lastName":    "Rubble",
         "address": {
            street: "123 Granite Way",
            "city": "Bedrock",
            "state": "NA",
            "zip": "123"
         },
         phonenumbers: [
            {"type": "mobile", number: "444" },
            {"type": "home",   number: "555" },
            {"type": "work",   number: "666" }
         ],
         "email": [
            { "type": "personal", "account": "Barney@Rubble.com" }
         ],
         "birthday":    "1972-01-01",
         "children":    "1"
      },
      {
         "firstName":   "Betty",
         "lastName":    "Rubble",
         "address": {
            street: "123 Granite Way",
            "city": "Bedrock",
            "state": "NA",
            "zip": "123"
         },
         phonenumbers: [
            {"type": "mobile", number: "444" },
            {"type": "home",   number: "555" },
            {"type": "work",   number: "666" }
         ],
         "email": [
            { "type": "personal", "account": "Betty@Rubble.com" }
         ],
         "birthday":    "1973-01-01",
         "children":    "1"
      }
   ];

   return {
      /*
       * Return all NON-DELETED contacts. If a contact is deleted while offline we don't
       * delete it locally. We'll delete if from the server and then refresh our local copy
       * from the server.
       */
      getAllContacts: function (successCallback) {
         var i;
         // todo - do we want to sort the returned array?
         localforage.getItem(localForageAppId, function (contacts) {
            for (i = 0; i < contacts.length; ++i) {
               if (contacts[i].isDeleted) {
                  contacts.splice(i, 1);            // Delete from the array
               }
            }
            successCallback(contacts);
         });
      },

      getContact: function (id, successCallback) {
         var i;
         localforage.getItem(localForageAppId, function (contacts) {
            for (i = 0; i < contacts.length; ++i) {
               if (contacts[i]._id === id) {
                  successCallback(contacts[i]);
                  break;
               }
            }
         });
      },

      addContact: function (newContact, successCallback) {
         var contacts;
         localforage.getItem(localForageAppId, function (data) {
            contacts = data;
         });
         newContact._id = JTS.getRandomInt(100000, 999999);    // Flag contact as new by having a blank _id
         newContact.isNew = true;
         contacts.push(newContact);
         localforage.setItem(localForageAppId, contacts);
         successCallback(newContact);
      },

      updateContact: function (id, contact, successCallback) {
         var i;
         localforage.getItem(localForageAppId, function (contacts) {
            for (i = 0; i < contacts.length; ++i) {
               if (contacts[i]._id === id) {
                  contacts[i] = contact;        // Update with new values
                  contacts[i].isDirty = true;   // Indicate it's now dirty
                  break;                        // Id's are supposed to be unique
               }
            }
            // Save updated contacts list back to localForage and
            // return the updated contact to our caller.
            localforage.setItem(localForageAppId, contacts, function(data) {
               successCallback(data[i]);
            });
         });
      },

      removeContact: function (id) {
         var i;
         localforage.getItem(localForageAppId, function (contacts) {
            for (i = 0; i < contacts.length; ++i) {
               if (contacts[i]._id === id) {
                  if (contacts[i]._id)
//                  contacts.splice(i, 1);      // Delete from the array
                  contacts[i].isDeleted = true;
                  break;                        // Id's are supposed to be unique
               }
            }
         });
      },

      getMetricsState: function (successCallback) {
         var states = {};
         localforage.getItem(localForageAppId, function (data) {
            data.forEach (function (element){
               // todo - I assume we need to test for null values! ie a states first use it won't be found
               states[element.address.state] = states[element.address.state] + 1;
            })
         });
      }
   }
});
