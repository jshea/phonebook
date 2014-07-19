"use strict";

/*
 * Controller for the edit screen when updating an existing contact
 */
app.controller("EditCtrl", function ($scope, $location, $routeParams, DataFactory, toaster) {
   DataFactory.getContact($routeParams.contactId, function (data, status, headers, config) {
      $scope.contact = data;
   });

   $scope.save = function () {
      DataFactory.updateContact($routeParams.id, $scope.contact, function (data, status, headers, config) {
         $scope.contact = data;
         toaster.pop("success", "Update Successful", data.firstname + " " + data.lastname + " has been updated");
         $location.path("/view/" + $scope.contact._id);
      });
   };

   $scope.remove = function () {
      DataFactory.removeContact($scope.contact._id);
      toaster.pop("success", "Contact deleted");
      $location.path("/");
   };

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});

/*
 * Controller for the phone number section of the edit screen
 */
app.controller("PhonenumberCtrl", function ($scope) {

   $scope.addNumber = function () {
      // In case phonenumbers isn't defined, initialize it to an empty array
      if ($scope.contact.phonenumbers === "undefined" || $scope.contact.phonenumbers === null) {
         $scope.contact.phonenumbers = [];
      }
      var phonenumbers = $scope.contact.phonenumbers;
      phonenumbers[phonenumbers.length] = {};
   };

   $scope.removeNumber = function (index) {
      $scope.contact.phonenumbers.splice(index, 1);
   };
});


/*
 * Controller for the email section of the edit screen
 */
app.controller("EmailCtrl", function ($scope) {

   $scope.addEmail = function () {
      // In case email isn't defined, initialize it to an empty array
      if ($scope.contact.email === "undefined" || $scope.contact.email === null) {
         $scope.contact.email = [];
      }
      var email = $scope.contact.email;
      email[email.length] = {};
   };

   $scope.removeEmail = function (index) {
      $scope.contact.email.splice(index, 1);
   };
});


/*
 * Controller for the children section of the edit screen
 */
app.controller("ChildrenCtrl", function ($scope) {

   $scope.addChild = function () {
      // In case children isn't defined, initialize it to an empty array
      if ($scope.contact.children === "undefined" || $scope.contact.children === null) {
         $scope.contact.children = [];
      }
      var children = $scope.contact.children;
      children[children.length] = {};
   };

   $scope.removeChild = function (index) {
      $scope.contact.children.splice(index, 1);
   };
});

