(function () {
  'use strict';

  angular
    .module('actualites.admin')
    .controller('ActualitesAdminController', ActualitesAdminController);

  ActualitesAdminController.$inject = ['$scope', '$state', '$window', 'actualiteResolve', 'Authentication', 'Notification'];

  function ActualitesAdminController($scope, $state, $window, actualite, Authentication, Notification) {
    var vm = this;

    vm.actualite = actualite;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing actualite
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.actualite.$remove(function () {
          $state.go('admin.actualites.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Actualite deleted successfully!' });
        });
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.actualiteForm');
        return false;
      }

      // Create a new actualite, or update the current instance
      vm.actualite.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.actualites.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> actualite saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> actualite save error!' });
      }
    }
  }
}());
