describe("httpFactory Test", function () {         // create a test Suite

   // Arrange
   var service, backend, google;

   beforeEach(angular.mock.module("phonebook"));   // create phonebook module

   beforeEach(angular.mock.inject(function (httpFactory, $httpBackend) {
      service = httpFactory;
      backend = $httpBackend;
//      sessionStorage.setItem("activeUser", "username");
   }));

   beforeEach(function () {
//      google = { maps : {
//            OverlayView : function () { },
//            Marker :      function () { },
//            InfoWindow :  function () { }
//         }
//      };
   });

   // Act and Assert
   // Tests are called specs
   it("Should have a httpFactory service", function () {
      expect(service).toBeDefined();      // Make sure our httpFactory is defined.
   });

   it("have all Ajax requests been received", function () {
      backend.verifyNoOutstandingExpectation();    // Check that all expected requests have been received.
   });

   it("should getAllContacts", function () {
      // Setup mock request and response with data
      backend.expect("GET", "/contactpicklist").respond([{"lastname": "Shea","firstname": "Jim", "phonenumbers": ["555 555-1212"]}]);   // Mock the request

      service.getAllContacts(function (data) {     // Call our function
         expect(data).toBeDefined();               // Test that data was returned
         expect(data[0].lastname).toEqual("Shea"); // Test we received our (mocked) data correctly
      });

      backend.flush();     // Send back pending response from $httpBackend (i.e. resolves promise)
   });

});
