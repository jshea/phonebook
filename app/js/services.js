"use strict";

//var url = "http://phonebookangular.herokuapp.com/";   // Heroku - Running Cordova compiled with data from Heroku hosted services
var url = "/";                                        // Local mongo/rest service and Heroku web app

app.factory("DataFactory", function ($http, toaster) {
   return {
      getAllContacts: function (callback) {
         $http.get(url + "contactpicklist")
            .success(callback)
            .error(function (data, status, headers, config) { // Add http error info to error toasts?
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      },
      getContact: function (id, callback) {
         $http.get(url + "contacts/" + id)
            .success(callback)
            .error(function () {
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      },
      addContact: function (contact, callback) {
         $http.post(url + "contacts/", contact)
            .success(
               callback
//               , toaster.pop("success", "Add Successful", "New contact has been added")
            )
            .error(function () {
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      },
      updateContact: function (id, contact) {
         $http.post(url + "contacts/" + id, contact)
            .success(function (data, status, headers, config) {
               toaster.pop("success", "Update Successful", data.firstname + " " + data.lastname + " has been updated");
            })
            .error(function () {
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      },
      removeContact: function (id) {
         $http.delete(url + "contacts/" + id)
            .success(function () {
               toaster.pop("success", "Delete Successful", "Contact has been deleted");
            })
            .error(function () {
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      },
      initializeData: function (callback) {
         $http.post(url + "reinitialize")
            .success(function (data, status, headers, config) {
               callback(data, status, headers, config);
               toaster.pop("success", "Delete Successful", "Contact has been deleted");
            })
            .error(function () {
               toaster.pop("error", "REST call failed", "The REST Web Service call to " + url + "contactpicklist failed.");
            });
      }
   };
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