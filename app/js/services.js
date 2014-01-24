"use strict";

var services = angular.module("phonebook.services", ["ngResource"]);

services.factory("Contact", ["$resource",
   function ($resource) {
      return $resource("/contacts/:id", {id: "@id"}); // Use the Contact.id for the id field
   }
]);

services.factory("MultiContactLoader", ["Contact", "$q",
   function (Contact, $q) {
      return function () {
         var contactListRequest = $q.defer();      // Creates a deferred object representing a task which will finish in the future
         Contact.query(function (contacts) {       // Returns a promise
            contactListRequest.resolve(contacts);  // Success callback upon task completion
         }, function () {
            contactListRequest.reject("Unable to fetch contacts");   // Error callback upon task failure
         });
         return contactListRequest.promise;
      };
   }
]);

services.factory("ContactLoader", ["Contact", "$route", "$q",
   function (Contact, $route, $q) {
      return function () {
         var contactRequest = $q.defer();
         Contact.get({id: $route.current.params.contactId}, function (contact) {
            contactRequest.resolve(contact);
         }, function () {
            contactRequest.reject("Unable to fetch contact " + $route.current.params.contactId);
         });
         return contactRequest.promise;
      };
   }
]);
