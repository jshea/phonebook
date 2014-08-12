"use strict";

/*
 * Controller for reinitializing the database
 */
app.controller("LoadDataCtrl", function ($scope, $location, dataFactory, toaster) {
   $scope.contacts = [];

   dataFactory.initializeData(function (data, status, headers, config) {
      if (data.result === "success") {
         toaster.pop("success", "Data Reload", "The sample data has been reinitialized");
         $location.path("/");
      } else {
         toaster.pop("error", "Reinitialization failed", "The call to reload data failed.");
      }
   });

   $("#menu-list").addClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").removeClass("active");
});
