(function () {
  'use strict';

  describe('Actualites Route Tests', function () {
    // Initialize global variables
    var $scope,
      ActualitesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ActualitesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ActualitesService = _ActualitesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('actualites');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/actualites');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('actualites.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/actualites/client/views/list-actualites.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ActualitesController,
          mockActualite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('actualites.view');
          $templateCache.put('/modules/actualites/client/views/view-actualite.client.view.html', '');

          // create mock actualite
          mockActualite = new ActualitesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Actualite about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ActualitesController = $controller('ActualitesController as vm', {
            $scope: $scope,
            actualiteResolve: mockActualite
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:actualiteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.actualiteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            actualiteId: 1
          })).toEqual('/actualites/1');
        }));

        it('should attach an actualite to the controller scope', function () {
          expect($scope.vm.actualite._id).toBe(mockActualite._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/actualites/client/views/view-actualite.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/actualites/client/views/list-actualites.client.view.html', '');

          $state.go('actualites.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('actualites/');
          $rootScope.$digest();

          expect($location.path()).toBe('/actualites');
          expect($state.current.templateUrl).toBe('/modules/actualites/client/views/list-actualites.client.view.html');
        }));
      });
    });
  });
}());
