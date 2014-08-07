app.factory('chartFactory', function () {
   return {
      getBarChartData: function (states, contactCount) {
         return {
            labels: states,
            datasets: [
               {
                  label: "Distribution of contacts by state",
                  fillColor: "rgba(151,187,205,0.5)",
                  strokeColor: "rgba(151,187,205,0.8)",
                  highlightFill: "rgba(151,187,205,0.75)",
                  highlightStroke: "rgba(151,187,205,1)",
                  data: contactCount
               }
            ]
         };
      },
      getPieChartData: function (contactCount) {
         return [
            {
//               value: employee.accrual.sick,
               value: contactCount[0],
               color: "#F7464A",
               highlight: "#FF5A5E",
               label: "We like"
            },
            {
               value: 20,
               color: "#46BFBD",
               highlight: "#5AD3D1",
               label: "Tolerated"
            },
            {
               value: 5,
               color: "#FDB45C",
               highlight: "#FFC870",
               label: "Can we delete these people please?"
            }
         ];
      }
   };
});