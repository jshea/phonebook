"use strict";

//var url = "http://phonebookangular.herokuapp.com/";   // Heroku - Running Cordova compiled with data from Heroku hosted services
var url = "/";                                        // Local mongo/rest service and Heroku web app

// Note we're importing Angular plugins as well as our own
var app = angular.module("phonebook", ["ngRoute",                 // Routing service, $routProvider
                                       "ngGrid",                  // Grid plugin (list of people on opening screen)
                                       "snap",                    // Side drawer
                                       "toaster",                 // Popup messages (toasts)
                                       "google-maps",             // Another Google maps http://angular-google-maps.org/use
                                       "phonebook.directives"]);    // Our directives

app.config(function (snapRemoteProvider) {
   snapRemoteProvider.globalOptions.disable = 'right';
});


/*
 * Routing for the application
 */
app.config(["$routeProvider", function ($routeProvider) {
   $routeProvider
      .when("/", {
         controller: "ListCtrl",
         templateUrl: "views/list.html"
      })

      .when("/edit/:contactId", {
         controller: "EditCtrl",
         templateUrl: "views/edit.html"
      })

      .when("/view/:contactId", {
         controller: "ViewCtrl",
         templateUrl: "views/viewDetail.html"
      })

      .when("/new", {
         controller: "NewCtrl",
         templateUrl: "views/edit.html"
      })

      .when("/metrics", {
         controller: "MetricsCtrl",
         templateUrl: "views/metrics.html"
      })

      .when("/load", {
         controller: "LoadDataCtrl",
         templateUrl: "views/list.html" // TODO - Why is templateUrl necessary? When removed, this route doesn't work!
      })

      .when("/about", {
         controller: "AboutCtrl",
         templateUrl: "views/about.html"
      })

      .otherwise({
         redirectTo: "/"
      });
}]);


/*
 * Controller for the main screen containing a grid with a listing of all contacts
 */
app.controller("ListCtrl", function ($scope, DataFactory, $location, toaster) {
   DataFactory.getAllContacts(function (data, status, headers, config) {
      // Add a function to each element that returns formatted full name - used by ng-grid.
      angular.forEach(data, function (row) {
         row.getFullName = function () {
            return this.lastname + ", " + this.firstname;
         };
      });

      $scope.contacts = data;
   });
   $scope.filterOptions = {
      filterText: "" // Do we really have to initialize filtering to a blank string?
   };

   $scope.gridOptions = {
      data: "contacts",
      columnDefs: [
         // These are here for the filtering to work.
         // http://stackoverflow.com/questions/17977869/how-to-filter-my-data-ng-grid
         {field: "firstname", visible: false},
         {field: "lastname",  visible: false},
         {field: "phonenumbers[0].number", visible: false},

         // Make a row clickable
         // http://stackoverflow.com/questions/19822133/angularjs-ng-grid-pass-row-column-field-into-ng-click-event
         {
            field: "getFullName()",
            displayName: "Name",
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a ng-click="loadById(row)">{{row.getProperty(col.field)}}</a></div>'
         },
         {field: "phonenumbers[0].number", displayName: "Phone", width: "125", cellFilter: "tel"}
      ],
      enableColumnReordering: true,
      enableSorting: true,
      filterOptions: $scope.filterOptions // Also tried setting ng-model to the direct scope object - still doesn't work anymore!
   };

   // The desire is to show the filtered size of the grid (grid.length?). Not working here
   // but works in the browser console!
   $scope.totalFilteredItemsLength = function () {
      return $scope.gridOptions.ngGrid.filteredRows.length;
   };

   $scope.loadById = function (row) {
      $location.path("/view/" + row.entity._id);
   };

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});


/*
 * Controller for viewing a contact
 */
app.controller("ViewCtrl", function ($scope, $location, $routeParams, DataFactory, toaster) {
   // We need to initialize our map with dummy data, otherwise it doesn't display.
   $scope.map = {
      center: {
         latitude: 39,
         longitude: -98
      },
      zoom: 14
   };

   // contactId is what the parameter was named in our routes
   DataFactory.getContact($routeParams.contactId, function (data, status, headers, config) {
      $scope.contact = data;
      $scope.age = moment().diff(data.birthday, "years");

      // Google address format - used to geocode (lookup) lat/lon for this address
      var googleAddress = data.address.street + " " + data.address.city + " " + data.address.state + " " + data.address.zip;

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
      DataFactory.removeContact($scope.contact._id);
      toaster.pop("success", "Delete Successful", "Contact has been deleted");
      $location.path("/");
   };

   $("#menu-list").removeClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});


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
 * Controller for the edit screen when adding a new contact
 */
app.controller("NewCtrl", function ($scope, $location, DataFactory, toaster) {

   // Create an empty contact to bind to the Add Screen
   $scope.contact = {
      phonenumbers: [ ],
      email: [ ],
      children: [ ]
   };

   $scope.save = function () {
      DataFactory.addContact($scope.contact, function (data, status, headers, config) {
         $scope.contact = data;
         toaster.pop("success", "Add Successful", data.firstname + " " + data.lastname + " has been added")
         $location.path("/view/" + $scope.contact._id);
      });
   };

   $("#menu-list").removeClass("active");
   $("#menu-new").addClass("active");
   $("#menu-about").removeClass("active");
});


/*
 * Controller for the metrics screen with sample charts
 */
app.controller("MetricsCtrl", function ($scope, $location, DataFactory, chartFactory) {

   DataFactory.getMetricsState(function (data, status, headers, config) {
      $scope.metricsByState = data;

      var states = [];
      var contactCount = [];
      $scope.metricsByState.forEach(function (state) {
         states.push(state._id);
         contactCount.push(state.count);
      });

      $scope.barChart = chartFactory.getBarChartData(states, contactCount);
      $scope.pieChart = chartFactory.getPieChartData(contactCount);
   });

   $("#menu-list").removeClass("active");
   $("#menu-new").addClass("active");
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


/*
 * Controller for the about screen
 */
app.controller("AboutCtrl", [
   function () {
      $("#menu-list").removeClass("active");
      $("#menu-new").removeClass("active");
      $("#menu-about").addClass("active");
   }]);


/*
 * Controller for reinitializing the database
 */
app.controller("LoadDataCtrl", function ($scope, $location, DataFactory, toaster) {
   $scope.contacts = [];

   DataFactory.initializeData(function (data, status, headers, config) {
      $scope.contacts = data;
      toaster.pop("success", "Data Reload", "The sample data has been reinitialized");
      $location.path("/");
   });

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});
