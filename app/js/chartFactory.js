app.factory('chartFactory', function () {
   return {
      getBarChartData: function (states, contactCount) {
         return {
            labels: states,
            datasets: [
               {
                  label: "Weekly Work Hours Distribution",
                  fillColor: "rgba(151,187,205,0.5)",
                  strokeColor: "rgba(151,187,205,0.8)",
                  highlightFill: "rgba(151,187,205,0.75)",
                  highlightStroke: "rgba(151,187,205,1)",
                  data: contactCount
               }
            ]
         };
      },
      getPieChartData: function (states, contactCount) {
         return [
            {
               value: employee.accrual.sick,
               color: "#F7464A",
               highlight: "#FF5A5E",
               label: "Sick Days"
            },
            {
               value: employee.accrual.vacation,
               color: "#46BFBD",
               highlight: "#5AD3D1",
               label: "Vacation Days"
            },
            {
               value: employee.accrual.personalholiday,
               color: "#FDB45C",
               highlight: "#FFC870",
               label: "Personal Holidays"
            }
         ];
      }
   };
});