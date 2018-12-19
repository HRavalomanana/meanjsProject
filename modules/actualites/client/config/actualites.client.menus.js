(function () {
    'use strict';

    angular
        .module('actualites')
        .run(menuConfig);

    menuConfig.$inject = ['menuService'];

    function menuConfig(menuService) {
        menuService.addMenuItem('topbar', {
            title: 'Actualités',
            state: 'actualites',
            type: 'dropdown',
            roles: ['*']
        });
        menuService.addSubMenuItem('topbar', 'actualites', {
            title: 'List actualite',
            state: 'actualites.list',
            roles: ['*']
        });

    }
}());
