(function () {
  'use strict';

  angular
    .module('actualites.admin')
    .controller('ActualitesAdminListController', ActualitesAdminListController);

    ActualitesAdminListController.$inject = ['ArticlesService'];

  function ActualitesAdminListController(ActualitesService) {
    var vm = this;

    vm.actualites = ActualitesService.query();
  }
}());
