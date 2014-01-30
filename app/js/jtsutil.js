/**
 * User: jshea
 * Date: 6/22/12
 * Time: 12:19 PM
 */
"use strict";
var JTS = JTS || {};            // Establish JTS namespace if it doesn't already exist

/*
 * This version modifies the String classes prototype. Probably
 * not a best practice
 *
 *
 */
//String.prototype.toProperCase = function () {
//   return this.replace(/\w\S*/g, function (txt) {
//    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
//};


/*
 * This version uses a passed in String. This isn't tested!
 */
JTS.toProperCase = function (string) {
   return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
   });
};


/*
 * Performs basic US phone number formatting if the number is
 * 7, 10 or 11 characters long.
 */
JTS.formatPhoneNumber = function (phoneNumber) {
   if (phoneNumber === undefined || phoneNumber === null) {
      return "";
   } else if (phoneNumber.length === 11) {
      return phoneNumber.substr(0, 1) + " (" +
         phoneNumber.substr(1, 3) + ") " +
         phoneNumber.substr(4, 3) +
         phoneNumber.substr(7, 4);
   } else if (phoneNumber.length === 10) {
      return "(" +
         phoneNumber.substr(0, 3) + ") " +
         phoneNumber.substr(3, 3) + "-" +
         phoneNumber.substr(6, 4);
   } else if (phoneNumber.length === 7) {
      return phoneNumber.substr(0, 3) + phoneNumber.substr(3, 4);
   } else {
      return phoneNumber;
   }
};


/*
 * Get a random number between min and max values
 *
 * Credit: Mozilla Developer Center
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
