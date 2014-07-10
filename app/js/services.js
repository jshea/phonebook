"use strict";

//var url = "http://phonebookangular.herokuapp.com/";   // Heroku - Running Cordova compiled with data from Heroku hosted services
var url = "/";                                        // Local mongo/rest service and Heroku web app

angular.module("phonebook").factory("DataFactory", function ($http, toaster) {
   return {
      getAllContacts: function (callback) {
         $http.get(url + "contactpicklist")
            .success(callback)
            .error(function (data, status, headers, config) {
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      }
   };
//      ,
//      getContactById: function (id) {
//         var contactRef = new Firebase(FBURL + id);
//         return $firebase(contactRef);
//      },
//      removeContactById: function (id) {
//         var contactRef = new Firebase(FBURL + id);
//         contactRef.remove();
//         $location.path("/");
//      },
//      updateNameById: function (id, first, last) {
//         var contactRef = new Firebase(FBURL + id);
//         contactRef.update({firstname: first, lastname: last});
//         contactRef.setPriority(last.toLowerCase() + " " + first.toLowerCase());
//         $location.path("/view/" + id);
//      },
//      saveNewName: function (first, last) {
//         var contactsRef = new Firebase(FBURL);
//         var newContactRef = contactsRef.push();
//
//         newContactRef.setWithPriority({firstname: first, lastname: last}, last.toLowerCase() + " " + first.toLowerCase());
//         $location.path("/view/" + newContactRef.name());
//      },
//      initializeData: function (data) {
//         var contactsRef = new Firebase(FBURL);
//         contactsRef.remove();
//
//         // Loop through the array of data inserting records individually. This
//         // lets us set the priority for each record. Priority determines the
//         // returned sort order.
//         data.forEach(function (element, index, array) {
//            var newContactRef = contactsRef.push(),
//               first = element.firstname,
//               last = element.lastname;
//            newContactRef.setWithPriority({firstname: first, lastname: last}, last.toLowerCase() + " " + first.toLowerCase());
//         });
//         $location.path("/");
//      }

});

/**
 * This is just a prototype of using a service for geocoding. It
 * isn't used in this application (yet).
 */
//app.service('GeoCode', function () {
//   this.getLatLon = function (address) {
//      // Get lat/lon for an address
//      var location = "";
//      var geocoder = new google.maps.Geocoder();
//      geocoder.geocode({ "address": googleAddress}, function (results, status) {
//         if (status === google.maps.GeocoderStatus.OK) {
//            location = results[0].geometry.location;
//         } else {
//            // toaster.pop("error", "Geocode was not successful", status);
//         }
//      });
//   };
//});