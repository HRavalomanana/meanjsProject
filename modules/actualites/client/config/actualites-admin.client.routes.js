(function () {
  'use strict';

  angular
    .module('actualites.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.actualites', {
        abstract: true,
        url: '/actualites',
        template: '<ui-view/>'
      })
      .state('admin.actualites.list', {
        url: '',
        templateUrl: '/modules/actualites/client/views/admin/list-actualites.client.view.html',
        controller: 'ActualitesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.actualites.create', {
        url: '/create',
        templateUrl: '/modules/actualites/client/views/admin/form-actualite.client.view.html',
        controller: 'ActualitesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          articleResolve: newActualite
        }
      })
      .state('admin.actualites.edit', {
        url: '/:articleId/edit',
        templateUrl: '/modules/actualites/client/views/admin/form-actualite.client.view.html',
        controller: 'ActualitesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ actualiteResolve.title }}'
        },
        resolve: {
          articleResolve: getActualite
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ActualitesService'];

  function getActualite($stateParams, ActualitesService) {
    return ActualitesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newActualite.$inject = ['ActualitesService'];

  function newActualite(ActualitesService) {
    return new ActualitesService();
  }
}());
