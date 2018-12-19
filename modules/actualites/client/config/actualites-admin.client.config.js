(function () {
  'use strict';

  // Configuring the actualites Admin module
  angular
    .module('actualites.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Actualites',
      state: 'admin.actualites.list'
    });
  }
}());
