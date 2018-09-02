/**
 * This file configures routing mechanism
 */

// Inject node module dependencies
var routes = require('./../routes');
var express = require('express');

module.exports = function (app) {
  // API ROUTES
  // get an instance of the router for api routes
  var apiRoutes = express.Router();
  routes.authenticationRoutes(apiRoutes);
  routes.otp(apiRoutes);

  // Add prefix to routes
  app.use('/', apiRoutes); // Assign name to end points (e.g., '/api/management/', '/api/users' ,etc. )
};
