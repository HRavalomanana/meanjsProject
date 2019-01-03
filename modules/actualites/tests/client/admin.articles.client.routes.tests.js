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
          mainstate = $state.get('admin.actualites');
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
          liststate = $state.get('admin.actualites.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/actualites/client/views/admin/list-actualites.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ActualitesAdminController,
          mockActualite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.actualites.create');
          $templateCache.put('/modules/actualites/client/views/admin/form-actualite.client.view.html', '');

          // Create mock actualite
          mockActualite = new ActualitesService();

          // Initialize Controller
          ActualitesAdminController = $controller('ActualitesAdminController as vm', {
            $scope: $scope,
            actualiteResolve: mockActualite
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.actualiteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/actualites/create');
        }));

        it('should attach an actualite to the controller scope', function () {
          expect($scope.vm.actualite._id).toBe(mockActualite._id);
          expect($scope.vm.actualite._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/actualites/client/views/admin/form-actualite.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ActualitesAdminController,
          mockActualite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.actualites.edit');
          $templateCache.put('/modules/actualites/client/views/admin/form-actualite.client.view.html', '');

          // Create mock actualite
          mockActualite = new ActualitesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Actualite about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ActualitesAdminController = $controller('ActualitesAdminController as vm', {
            $scope: $scope,
            actualiteResolve: mockActualite
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:actualiteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.actualiteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            actualiteId: 1
          })).toEqual('/admin/actualites/1/edit');
        }));

        it('should attach an actualite to the controller scope', function () {
          expect($scope.vm.actualite._id).toBe(mockActualite._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/actualites/client/views/admin/form-actualite.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
