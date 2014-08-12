"use strict";

/*
 * Controller for the metrics screen with sample charts
 */
app.controller("MetricsCtrl", function ($scope, $location, dataFactory, chartFactory) {

   dataFactory.getMetricsState(function (data, status, headers, config) {
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
