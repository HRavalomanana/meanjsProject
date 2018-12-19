'use strict';

/**
 * Module dependencies
 */
var actualitesPolicy = require('../policies/actualites.server.policy'),
  actualites = require('../controllers/actualites.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/actualites').all(actualitesPolicy.isAllowed)
    .get(actualites.list)
    .post(actualites.create);

  // Single actualite routes
  app.route('/api/actualites/:actualiteId').all(actualitesPolicy.isAllowed)
    .get(actualites.read)
    .put(actualites.update)
    .delete(actualites.delete);

  // Finish by binding the actualite middleware
  app.param('actualiteId', actualites.actualiteByID);
};
