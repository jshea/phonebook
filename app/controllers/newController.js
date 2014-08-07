"use strict";

/*
 * Controller for the edit screen when adding a new contact
 */
app.controller("NewCtrl", function ($scope, $location, HttpFactory, toaster) {

   // Create an empty contact to bind to the Add Screen
   $scope.contact = {
      phonenumbers: [ ],
      email: [ ],
      children: [ ]
   };

   $scope.save = function () {
      HttpFactory.addContact($scope.contact, function (data, status, headers, config) {
         $scope.contact = data;
         toaster.pop("success", "Add Successful", data.firstname + " " + data.lastname + " has been added")
         $location.path("/view/" + $scope.contact._id);
      });
   };

   $("#menu-list").removeClass("active");
   $("#menu-new").addClass("active");
   $("#menu-about").removeClass("active");
});
