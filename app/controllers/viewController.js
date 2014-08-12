"use strict";

/*
 * Controller for viewing a contact
 */
app.controller("ViewCtrl", function ($scope, $location, $routeParams, dataFactory, toaster) {
   // We need to initialize our map with dummy data, otherwise it doesn't display.
   $scope.map = {
      center: {
         latitude: 39,
         longitude: -98
      },
      zoom: 14
   };

   // contactId is what the parameter was named in our routes
   dataFactory.getContact($routeParams.contactId, function (data, status, headers, config) {
      $scope.contact = data;
      $scope.age = moment().diff(data.birthday, "years");

      // Google address format - used to geocode (lookup) lat/lon for this address
      var googleAddress = data.address.street + " " + data.address.city + " " + data.address.state + " " + data.address.zip;

      // todo - This won't work when offline - need to add network test
      // Get lat/lon for an address
      var location;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ "address": googleAddress }, function (results, status) {
         if (status === google.maps.GeocoderStatus.OK) {
            location = results[0].geometry.location;

            // Set ng-map to the lat/lon for this address
            $scope.map = {
               center: {
                  latitude:  location.lat(),
                  longitude: location.lng()
               },
               zoom: 14
            };
            // Tell angular to refresh bindings because we updated $scope in a callback
            $scope.$apply();
         } else {
            toaster.pop("error", "Geocode was not successful", status);
         }
      });
   });

   $scope.edit = function () {
      $location.path("/edit/" + $scope.contact._id);
   };

   $scope.remove = function () {
      dataFactory.removeContact($scope.contact._id);
      toaster.pop("success", "Delete Successful", "Contact has been deleted");
      $location.path("/");
   };

   $("#menu-list").removeClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});
