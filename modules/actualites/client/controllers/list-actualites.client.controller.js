(function () {
  'use strict';

  angular
    .module('actualites')
    .controller('ActualitesListController', ActualitesListController);

  ActualitesListController.$inject = ['ActualitesService'];

  function ActualitesListController(ActualitesService) {
    var vm = this;

    vm.actualites = ActualitesService.query();
  }
}());
