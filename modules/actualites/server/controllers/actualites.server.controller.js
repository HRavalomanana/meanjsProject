'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Actualite = mongoose.model('Actualite'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an actualite
 */
exports.create = function (req, res) {
  var actualite = new actualite(req.body);
  actualite.user = req.user;

  actualite.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(actualite);
    }
  });
};

/**
 * Show the current actualite
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var actualite = req.actualite ? req.actualite.toJSON() : {};

  // Add a custom field to the Actualite, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Actualite model.
  actualite.isCurrentUserOwner = !!(req.user && actualite.user && actualite.user._id.toString() === req.user._id.toString());

  res.json(actualite);
};

/**
 * Update an actualite
 */
exports.update = function (req, res) {
  var actualite = req.actualite;

  actualite.title = req.body.title;
  actualite.content = req.body.content;

  actualite.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(actualite);
    }
  });
};

/**
 * Delete an actualite
 */
exports.delete = function (req, res) {
  var actualite = req.actualite;

  actualite.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(actualite);
    }
  });
};

/**
 * List of Actualites
 */
exports.list = function (req, res) {
  Actualite.find().sort('-created').populate('user', 'displayName').exec(function (err, actualites) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(actualites);
    }
  });
};

/**
 * Actualite middleware
 */
exports.actualiteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Actualite is invalid'
    });
  }

  Actualite.findById(id).populate('user', 'displayName').exec(function (err, actualite) {
    if (err) {
      return next(err);
    } else if (!actualite) {
      return res.status(404).send({
        message: 'No actualite with that identifier has been found'
      });
    }
    req.actualite = actualite;
    next();
  });
};
