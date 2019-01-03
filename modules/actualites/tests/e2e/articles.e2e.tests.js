'use strict';

describe('Actualites E2E Tests:', function () {
  describe('Test actualites page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/actualites');
      expect(element.all(by.repeater('actualite in actualites')).count()).toEqual(0);
    });
  });
});
