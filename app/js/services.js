/**
 * This is just a prototype of using a service for geocoding. It
 * isn't used in this application (yet).
 */
"use strict";

app.service('GeoCode', function () {
   this.getLatLon = function (address) {
      // Get lat/lon for an address
      var location = "";
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': googleAddress}, function (results, status) {
         if (status === google.maps.GeocoderStatus.OK) {
            location = results[0].geometry.location;
         } else {
            // toaster.pop("error", "Geocode was not successful", status);
         }
      });
   };
});