"use strict";

var directives = angular.module("phonebook.directives", []);

directives.directive("butterbar", ["$rootScope",
   function ($rootScope) {
      return {
         link: function (scope, element, attrs) {
            element.addClass("hidden");

            $rootScope.$on("$routeChangeStart", function () {
               element.removeClass("hidden");
            });

            $rootScope.$on("$routeChangeSuccess", function () {
               element.addClass("hidden");
            });
         }
      };
   }
   ]);

directives.directive("focus",
   function () {
      return {
         link: function (scope, element, attrs) {
            element[0].focus();
         }
      };
   });
