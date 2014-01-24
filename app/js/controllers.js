"use strict";

var app = angular.module("phonebook", ["ngRoute", "phonebook.directives", "phonebook.services"]);

app.config(["$routeProvider", function ($routeProvider) {
   $routeProvider
      .when("/", {
         controller: "ListCtrl",
         resolve: {
            // The controller sets $scope to the value of contacts
            contacts: ["MultiContactLoader", function (MultiContactLoader) {
               return new MultiContactLoader(); // I added the "new" because jslint was complaining. Not sure when "new" is required.
            }]
         },
         templateUrl: "/views/list.html"
      })

      .when("/edit/:contactId", {
         controller: "EditCtrl",
         resolve: {
            contact: ["ContactLoader", function (ContactLoader) {
               return new ContactLoader();   // I added the "new" because jslint was complaining. Not sure when "new" is required.
            }]
         },
         templateUrl: "/views/edit.html"
      })

      .when("/view/:contactId", {
         controller: "ViewCtrl",
         resolve: {
            contact: ["ContactLoader", function (ContactLoader) {
               return new ContactLoader();   // I added the "new" because jslint was complaining. Not sure when "new" is required.
            }]
         },
         templateUrl: "/views/viewDetail.html"
      })

      .when("/new", {
         controller: "NewCtrl",
         templateUrl: "/views/edit.html"
      })

      .when("/about", {
         controller: "AboutCtrl",
         templateUrl: "/views/about.html"
      })

      .otherwise({
         redirectTo: "/"
      });
}]);


app.controller("ListCtrl", ["$scope", "contacts",
   function ($scope, contacts) {
      $scope.contacts = contacts;

      $("#menu-list").addClass("active");
      $("#menu-new").removeClass("active");
      $("#menu-about").removeClass("active");
   }]);


app.controller("ViewCtrl", ["$scope", "$location", "contact",
   function ($scope, $location, contact) {
      $scope.contact = contact;

      $scope.edit = function () {
         $location.path("/edit/" + contact.id);
      };
      $("#menu-list").removeClass("active");
      $("#menu-new").removeClass("active");
      $("#menu-about").removeClass("active");
   }]);


app.controller("EditCtrl", ["$scope", "$location", "contact",
   function ($scope, $location, contact) {
      $scope.contact = contact;

      $scope.save = function () {
         $scope.contact.$save(function (contact) {
            $location.path("/view/" + contact.id);
         });
      };

      $scope.remove = function () {
         // TODO - Note this only deletes the contact from $scope, doesn't call a WS
//         delete $scope.contact;
         // TODO - Why isn't it
         $scope.contact.$remove();
         $location.path("/");
      };

      $("#menu-list").addClass("active");
      $("#menu-new").removeClass("active");
      $("#menu-about").removeClass("active");
   }]);


app.controller("NewCtrl", ["$scope", "$location", "Contact",
   function ($scope, $location, Contact) {

      $scope.contact = new Contact({
         phonenumbers: [ ],
         email: [ ],
         children: [ ]
      });

      $scope.save = function () {
         $scope.contact.$save(function (contact) {
            $location.path("/view/" + contact.id);
         });
      };
      $("#menu-list").removeClass("active");
      $("#menu-new").addClass("active");
      $("#menu-about").removeClass("active");
   }]);


app.controller("PhonenumberCtrl", ["$scope",
   function ($scope) {

      $scope.addNumber = function () {
         // In case phonenumbers isn't defined, initialize it to an empty array
         if ($scope.contact.phonenumbers == null) {
            $scope.contact.phonenumbers = [];
         }
         var phonenumbers = $scope.contact.phonenumbers;
         phonenumbers[phonenumbers.length] = {};
      };

      $scope.removeNumber = function (index) {
         $scope.contact.phonenumbers.splice(index, 1);
      };
   }]);


app.controller("EmailCtrl", ["$scope",
   function ($scope) {

      $scope.addEmail = function () {
         // In case email isn't defined, initialize it to an empty array
         if ($scope.contact.email == null) {
            $scope.contact.email = [];
         }
         var email = $scope.contact.email;
         email[email.length] = {};
      };

      $scope.removeEmail = function (index) {
         $scope.contact.email.splice(index, 1);
      };
   }]);


app.controller("ChildrenCtrl", ["$scope",
   function ($scope) {

      $scope.addChild = function () {
         // In case children isn't defined, initialize it to an empty array
         if ($scope.contact.children == null) {
            $scope.contact.children = [];
         }
         var children = $scope.contact.children;
         children[children.length] = {};
      };

      $scope.removeChild = function (index) {
         $scope.contact.children.splice(index, 1);
      };
   }]);


app.controller("AboutCtrl", [
   function () {
      $("#menu-list").removeClass("active");
      $("#menu-new").removeClass("active");
      $("#menu-about").addClass("active");
   }]);
