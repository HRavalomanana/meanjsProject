(function () {
  'use strict';

  angular
    .module('actualites.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('actualites', {
        abstract: true,
        url: '/actualites',
        template: '<ui-view/>'
      })
      .state('actualites.list', {
        url: '',
        templateUrl: '/modules/actualites/client/views/list-actualites.client.view.html',
        controller: 'ActualitesListController',
        controllerAs: 'vm'
      })
      .state('actualites.view', {
        url: '/:actualiteId',
        templateUrl: '/modules/actualites/client/views/view-actualite.client.view.html',
        controller: 'Actualites',
        controllerAs: 'vm',
        resolve: {
          actualiteResolve: getActualite
        },
        data: {
          pageTitle: '{{ actualiteResolve.title }}'
        }
      });
  }

  getActualite.$inject = ['$stateParams', 'ActualitesService'];

  function getActualite($stateParams, ActualitesService) {
    return ActualitesService.get({
      actualiteId: $stateParams.articleId
    }).$promise;
  }
}());
