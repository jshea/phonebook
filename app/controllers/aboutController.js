"use strict";

/*
 * Controller for the about screen
 */
app.controller("AboutCtrl", function () {
   $("#menu-list").removeClass("active");
   $("#menu-new").removeClass("active");
   $("#menu-about").addClass("active");
});
