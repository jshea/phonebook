app.factory('dataFactory', function ($rootScope, httpFactory, forageFactory, localForageAppId) {
   return {
      getAllContacts: function (successCallback) {
         if ($rootScope.online) {
            httpFactory.getAllContacts(successCallback);
         } else {
            forageFactory.getAllContacts(successCallback);
         }
      },

      getContact: function (id, successCallback) {
         if ($rootScope.online) {
            httpFactory.getContact(id, successCallback);
         } else {
            forageFactory.getContact(id, successCallback);
         }
      },

      addContact: function (contact, successCallback) {
         if ($rootScope.online) {
            httpFactory.addContact(contact, successCallback);
         } else {
            forageFactory.addContact(contact, successCallback);
         }
      },

      updateContact: function (id, contact, successCallback) {
         if ($rootScope.online) {
            httpFactory.updateContact(id, contact, successCallback);
         } else {
            forageFactory.updateContact(id, contact, successCallback);
         }
      },

      removeContact: function (id, successCallback) {
         if ($rootScope.online) {
            httpFactory.removeContact(id);
         } else {
            forageFactory.removeContact(id);
         }
      },

      initializeData: function (successCallback) {
         if ($rootScope.online) {
            httpFactory.initializeData(successCallback);
         } else {
            forageFactory.initializeData(successCallback);
         }
      },

      getMetricsState: function (successCallback) {
         if ($rootScope.online) {
            httpFactory.getMetricsState(successCallback);
         } else {
            forageFactory.getMetricsState(successCallback);
         }
      },

      updateDirtyContacts: function () {
         // Additions, Updates and Deletions are stored in localForageAppId
         // Updates have an isDirty property
         // Adds    isNew is true, _id has a temp value to be cleared out
         // Deletes have a delete property
         localforage.getItem(localForageAppId, function (contacts) {
            contacts.forEach(function (contact) {
               if (contact.isDirty) {           // Is it updated?
                  delete contact.isDirty;
                  httpFactory.updateContact(contact._id, contact, function (data) {
                     console.dir("Successfully updated dirty contact " + data.firstName + " " + data.lastName);
                  });
               } else if (contact.isNew) {   // Is it an added contact?
                  delete contact._id;        // Remove our temp _id, it will be assigned by mongo
                  httpFactory.addContact(contact, function (data) {
                     console.dir("Successfully added new contact " + data.firstName + " " + data.lastName);
                  });
               } else if (contact.isDeleted) { // Is it a deleted contact?
                  httpFactory.removeContact(contact);
                  console.dir("Successfully deleted contact " + data.firstName + " " + data.lastName);
               }
            });
         });
      }

   };
});
