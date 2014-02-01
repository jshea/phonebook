/*
 * Angular custom filter to format telephone numbers.
 *    http://stackoverflow.com/questions/12700145/how-to-format-a-telephone-number-in-angularjs
 */
angular.module('ng').filter('tel', function () {
   return function (tel) {
      if (!tel) { return ''; }

      var value = tel.toString().trim().replace(/^\+/, ''),
         country,
         city,
         number;

      if (value.match(/[^0-9]/)) {
         return tel;
      }

      switch (value.length) {
      case 10: // +1PPP####### -> C (PPP) ###-####
         country = 1;
         city = value.slice(0, 3);
         number = value.slice(3);
         break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
         country = value[0];
         city = value.slice(1, 4);
         number = value.slice(4);
         break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
         country = value.slice(0, 3);
         city = value.slice(3, 5);
         number = value.slice(5);
         break;

      default:
         return tel;
      }

      if (country === 1) {
         country = "";
      }

      number = number.slice(0, 3) + '-' + number.slice(3);

      return (country + " (" + city + ") " + number).trim();
   };
});