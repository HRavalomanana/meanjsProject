(function () {
  'use strict';

  angular
    .module('actualites')
    .controller('ActualitesController', ActualitesController);

  ActualitesController.$inject = ['$scope', 'actualiteResolve', 'Authentication'];

  function ActualitesController($scope, actualite, Authentication) {
    var vm = this;

    vm.actualite = actualite;
    vm.authentication = Authentication;

  }
}());
