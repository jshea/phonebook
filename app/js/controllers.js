"use strict";

// Note we're importing Angular plugins as well as our own
var app = angular.module("phonebook", ["ngRoute",                 // Routing service, $routProvider
                                       "ngGrid",                  // Grid plugin (list of people on opening screen)
                                       "ui.bootstrap",            // Angular directives implementing Bootstrap (tabs)
                                       "snap",                    // Side drawer
//                                     "ui.tinymce",              // wysiwyg editor
//                                     "ui-map",                  // Google maps
                                       "phonebook.directives"]);  // Our directives

app.config(function (snapRemoteProvider) {
   snapRemoteProvider.globalOptions.disable = 'right';
});

app.config(["$routeProvider", function ($routeProvider) {
   $routeProvider
      .when("/", {
         controller: "ListCtrl",
         templateUrl: "/views/list.html"
      })

      .when("/edit/:contactId", {
         controller: "EditCtrl",
         templateUrl: "/views/edit.html"
      })

      .when("/view/:contactId", {
         controller: "ViewCtrl",
         templateUrl: "/views/viewDetail.html"
      })

      .when("/new", {
         controller: "NewCtrl",
         templateUrl: "/views/edit.html"
      })

      .when("/load", {
         controller: "LoadDataCtrl",
         templateUrl: "/views/list.html" // Why is templateUrl necessary? When removed, this route doesn't work!
      })

      .when("/about", {
         controller: "AboutCtrl",
         templateUrl: "/views/about.html"
      })

      .otherwise({
         redirectTo: "/"
      });
}]);


app.controller("ListCtrl", function ($scope, $http, $location) {
   $scope.contacts = [];

   $http.get("contactpicklist")
      .success(function (data, status, headers, config) {
         $scope.contacts = data;
      })
      .error(function (data, status, headers, config) {
         // called asynchronously if an error occurs or server returns response with an error status.
      });

   $scope.gridOptions = {
      data: "contacts",
      columnDefs: [
         // Make a row clickable
         // http://stackoverflow.com/questions/19822133/angularjs-ng-grid-pass-row-column-field-into-ng-click-event
         {
            field: "lastname + ', ' + firstname",
            displayName: "Name",
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a ng-click="loadById(row)">{{row.getProperty(col.field)}}</a></div>'
         },
         {field: "phonenumbers[0].number", displayName: "Phone", cellFilter: "tel"},
         // These are here for the filtering to work.
         {field: "firstname", visible: false},
         {field: "lastname",  visible: false},
         {field: "phonenumbers[0].number", visible: false}
      ],
      enableColumnReordering: true,
      enableSorting: true,
      filterOptions: $scope.filterOptions
   };

   $scope.filterOptions = {
      filterText: ""
   };

   // The desire is to show the filtered size of the grid (grid.length?). Not working here
   // but works in the browser console!
   $scope.totalFilteredItemsLength = function () {
      return $scope.gridOptions.ngGrid.filteredRows.length;
   };

   $scope.loadById = function (row) {
      console.log(row.entity);
      $location.path("/view/" + row.entity._id);
   };

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});


app.controller("ViewCtrl", function ($scope, $location, $http, $routeParams) {
   // contactId is what the parameter was named in our routes
   $http.get("contacts/" + $routeParams.contactId)
      .success(function (data, status, headers, config) {
         $scope.contact = data;
         $scope.age = moment().diff(data.birthday, "years");

//         $scope.mapOptions = {
//            center: new google.maps.LatLng(35.784, -78.670),
//            zoom: 15,
//            mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
      })
      .error(function (data, status, headers, config) {
         // called asynchronously if an error occurs or server returns response with an error status.
      });

   $scope.edit = function () {
      $location.path("/edit/" + $scope.contact._id);
   };

   $scope.remove = function () {
      $http.delete("contacts/" + $scope.contact._id)
         .success(function (data, status, headers, config) {
            $scope.contact = data;
            $location.path("/");
         })
         .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
         });

//       Contact.delete(contact._id); // Should also be able to do it this way if Contact is injected
      $location.path("/");
   };

   $("#menu-list").removeClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});


app.controller("EditCtrl", function ($scope, $location, $http, $routeParams) {
   $http.get("contacts/" + $routeParams.contactId)
      .success(function (data, status, headers, config) {
         $scope.contact = data;
      })
      .error(function (data, status, headers, config) {
         // called asynchronously if an error occurs or server returns response with an error status.
      });

   $scope.save = function () {
      $http.post("contacts/" + $scope.contact._id, $scope.contact)
         .success(function (data, status, headers, config) {
            $scope.contact = data;
            $location.path("/view/" + $scope.contact._id);
         })
         .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
         });
   };

   $scope.remove = function () {
      $http.delete("contacts/" + $scope.contact._id)
         .success(function (data, status, headers, config) {
            $scope.contact = data;
            $location.path("/");
         })
         .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
         });

//       Contact.delete(contact._id); // Should also be able to do it this way if Contact is injected
      $location.path("/");
   };

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});


app.controller("NewCtrl", function ($scope, $location, $http) {

   $scope.contact = {
      phonenumbers: [ ],
      email: [ ],
      children: [ ]
   };

   $scope.save = function () {
      $http.post("contacts", $scope.contact)
         .success(function (data, status, headers, config) {
            $scope.contact = data;
            $location.path("/view/" + $scope.contact._id);
         })
         .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
         });
   };

   $("#menu-list").removeClass("active");
   $("#menu-new").addClass("active");
   $("#menu-about").removeClass("active");
});


app.controller("PhonenumberCtrl", function ($scope) {

   $scope.addNumber = function () {
      // In case phonenumbers isn't defined, initialize it to an empty array
      if (typeof $scope.contact.phonenumbers === "undefined" || $scope.contact.phonenumbers === null) {
         $scope.contact.phonenumbers = [];
      }
      var phonenumbers = $scope.contact.phonenumbers;
      phonenumbers[phonenumbers.length] = {};
   };

   $scope.removeNumber = function (index) {
      $scope.contact.phonenumbers.splice(index, 1);
   };
});


app.controller("EmailCtrl", function ($scope) {

   $scope.addEmail = function () {
      // In case email isn't defined, initialize it to an empty array
      if (typeof $scope.contact.email === "undefined" || $scope.contact.email === null) {
         $scope.contact.email = [];
      }
      var email = $scope.contact.email;
      email[email.length] = {};
   };

   $scope.removeEmail = function (index) {
      $scope.contact.email.splice(index, 1);
   };
});


app.controller("ChildrenCtrl", function ($scope) {

   $scope.addChild = function () {
      // In case children isn't defined, initialize it to an empty array
      if (typeof $scope.contact.children === "undefined" || $scope.contact.children === null) {
         $scope.contact.children = [];
      }
      var children = $scope.contact.children;
      children[children.length] = {};
   };

   $scope.removeChild = function (index) {
      $scope.contact.children.splice(index, 1);
   };
});


app.controller("AboutCtrl", [
   function () {
      $("#menu-list").removeClass("active");
      $("#menu-new").removeClass("active");
      $("#menu-about").addClass("active");
   }]);


/*
 * Controller for reinitializing the database
 */

app.controller("LoadDataCtrl", function ($scope, $location, $http) {
//   console.log("Made it to LoadDataCtrl");
   $scope.contacts = [];

   $http.post("reinitialize")
      .success(function (data, status, headers, config) {
         $scope.contacts = data;
         $location.path("/");
      })
      .error(function (data, status, headers, config) {
         // called asynchronously if an error occurs or server returns response with an error status.
         console.log("Error calling /reinitialize");
      });

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});
