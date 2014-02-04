"use strict";

var services = angular.module("phonebook.services", ["ngResource"]);

/* This is another way of doing it?
 var Todo = $resource('/data/todos/:action/:id', {id: '@id'}, {
 'query' : { method: 'GET', isArray: true },
 'save'  : { method: 'POST',   params: { action: 'save' } },
 'update': { method: 'PUT',    params: { action: 'update' } },
 'remove': { method: 'DELETE', params: { action: 'remove' } },
 'get'   : { method: 'GET',    params: { action: 'get' } }
 });
 */

// https://groups.google.com/forum/#!searchin/angular/%22$24delete%22/angular/CBWLTmp_Zp8/CB2LZ4-Rbe4J
services.factory("Contact", ["$resource",
   function ($resource) {
      return $resource("/contacts/:id", {_id: "@id"}); // Use _id for the id field
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
