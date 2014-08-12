"use strict";

// Note we're importing Angular plugins as well as our own
var app = angular.module("phonebook", [
   "ngRoute",                 // Routing service, $routProvider
   "ngGrid",                  // Grid plugin (list of people on opening screen)
   "snap",                    // Side drawer
   "toaster",                 // Popup messages (toasts)
   "google-maps",             // Another Google maps http://angular-google-maps.org/use
   "angles",
   "phonebook.directives"]);    // Our directives

app.config(function (snapRemoteProvider) {
   snapRemoteProvider.globalOptions.disable = 'right';
});

app.constant("localForageAppId", "contacts");            // This is the localStorage/IndexedDB key

// Network listener
// http://stackoverflow.com/questions/16242389/how-to-check-internet-connection-in-angularjs
app.run(function ($window, $rootScope, dataFactory) {
   $rootScope.online = navigator.onLine;

   $window.addEventListener("offline", function () {
      $rootScope.$apply(function () {
         $rootScope.online = false;
         console.log("Online Status: " + $rootScope.online);
      });
   }, false);

   $window.addEventListener("online", function () {
      $rootScope.$apply(function () {
         if (!$rootScope.online) {
            dataFactory.updateDirtyContacts();
         }
         $rootScope.online = true;
         console.log("Online Status: " + $rootScope.online);
      });
   }, false);
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
