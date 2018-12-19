(function (app) {
  'use strict';

  app.registerModule('actualites', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('actualites.admin', ['core.admin']);
  app.registerModule('actualites.admin.routes', ['core.admin.routes']);
  app.registerModule('actualites.services');
  app.registerModule('actualites.routes', ['ui.router', 'core.routes', 'actualites.services']);
}(ApplicationConfiguration));
