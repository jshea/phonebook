"use strict";

/*
 * Controller for the main screen containing a grid with a listing of all contacts
 */
app.controller("ListCtrl", function ($scope, HttpFactory, $location, toaster) {
   HttpFactory.getAllContacts(function (data, status, headers, config) {
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
