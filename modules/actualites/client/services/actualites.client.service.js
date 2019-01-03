(function () {
  'use strict';

  angular
    .module('actualites.services')
    .factory('ActualitesService', ActualitesService);

    ActualitesService.$inject = ['$resource', '$log'];

  function ActualitesService($resource, $log) {
    var Actualite = $resource('/api/actualites/:actualiteId', {
      actualiteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Actualite.prototype, {
      createOrUpdate: function () {
        var actualite = this;
        return createOrUpdate(actualite);
      }
    });

    return Actualite;

    function createOrUpdate(actualite) {
      if (actualite._id) {
        return actualite.$update(onSuccess, onError);
      } else {
        return actualite.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(actualite) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
