"use strict";

/*
 * Controller for reinitializing the database
 */
app.controller("LoadDataCtrl", function ($scope, $location, HttpFactory, toaster) {
   $scope.contacts = [];

   HttpFactory.initializeData(function (data, status, headers, config) {
      $scope.contacts = data;
      toaster.pop("success", "Data Reload", "The sample data has been reinitialized");
      $location.path("/");
   });

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});
