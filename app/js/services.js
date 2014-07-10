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
//      getContact:     function (id) { },
//      removeContact:  function (id) { },
//      updateContact:  function (id, object) { },
//      addContact:     function (obj) { },
//      initializeData: function (data) { }

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