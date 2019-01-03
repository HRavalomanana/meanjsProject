'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Actualite = mongoose.model('Actualite'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  actualite;

/**
 * Actualite routes tests
 */
describe('Actualite CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new actualite
    user.save()
      .then(function () {
        actualite = {
          title: 'Actualite Title',
          content: 'Actualite Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an actualite if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/actualites')
          .send(actualite)
          .expect(403)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Call the assertion callback
            done(actualiteSaveErr);
          });

      });
  });

  it('should not be able to save an actualite if not logged in', function (done) {
    agent.post('/api/actualites')
      .send(actualite)
      .expect(403)
      .end(function (actualiteSaveErr, actualiteSaveRes) {
        // Call the assertion callback
        done(actualiteSaveErr);
      });
  });

  it('should not be able to update an actualite if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/actualites')
          .send(actualite)
          .expect(403)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Call the assertion callback
            done(actualiteSaveErr);
          });
      });
  });

  it('should be able to get a list of actualites if not signed in', function (done) {
    // Create new actualite model instance
    var actualiteObj = new Actualite(actualite);

    // Save the actualite
    actualiteObj.save(function () {
      // Request actualites
      agent.get('/api/actualites')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single actualite if not signed in', function (done) {
    // Create new actualite model instance
    var actualiteObj = new Actualite(actualite);

    // Save the actualite
    actualiteObj.save(function () {
      agent.get('/api/actualites/' + actualiteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', actualite.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single actualite with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/actualites/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Actualite is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single actualite which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent actualite
    agent.get('/api/actualites/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No actualite with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an actualite if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/actualites')
          .send(actualite)
          .expect(403)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Call the assertion callback
            done(actualiteSaveErr);
          });
      });
  });

  it('should not be able to delete an actualite if not signed in', function (done) {
    // Set actualite user
    actualite.user = user;

    // Create new actualite model instance
    var actualiteObj = new Actualite(actualite);

    // Save the actualite
    actualiteObj.save(function () {
      // Try deleting actualite
      agent.delete('/api/actualites/' + actualiteObj._id)
        .expect(403)
        .end(function (actualiteDeleteErr, actualiteDeleteRes) {
          // Set message assertion
          (actualiteDeleteRes.body.message).should.match('User is not authorized');

          // Handle actualite error error
          done(actualiteDeleteErr);
        });

    });
  });

  it('should be able to get a single actualite that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new actualite
          agent.post('/api/actualites')
            .send(actualite)
            .expect(200)
            .end(function (actualiteSaveErr, actualiteSaveRes) {
              // Handle actualite save error
              if (actualiteSaveErr) {
                return done(actualiteSaveErr);
              }

              // Set assertions on new actualite
              (actualiteSaveRes.body.title).should.equal(actualite.title);
              should.exist(actualiteSaveRes.body.user);
              should.equal(actualiteSaveRes.body.user._id, orphanId);

              // force the actualite to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the actualite
                    agent.get('/api/actualites/' + actualiteSaveRes.body._id)
                      .expect(200)
                      .end(function (actualiteInfoErr, actualiteInfoRes) {
                        // Handle actualite error
                        if (actualiteInfoErr) {
                          return done(actualiteInfoErr);
                        }

                        // Set assertions
                        (actualiteInfoRes.body._id).should.equal(actualiteSaveRes.body._id);
                        (actualiteInfoRes.body.title).should.equal(actualite.title);
                        should.equal(actualiteInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single actualite if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new actualite model instance
    var actualiteObj = new Actualite(actualite);

    // Save the actualite
    actualiteObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/actualites/' + actualiteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', actualite.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single actualite, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'actualiteowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Actualite
    var _actualiteOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _actualiteOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Actualite
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new actualite
          agent.post('/api/actualites')
            .send(actualite)
            .expect(200)
            .end(function (actualiteSaveErr, actualiteSaveRes) {
              // Handle actualite save error
              if (actualiteSaveErr) {
                return done(actualiteSaveErr);
              }

              // Set assertions on new actualite
              (actualiteSaveRes.body.title).should.equal(actualite.title);
              should.exist(actualiteSaveRes.body.user);
              should.equal(actualiteSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the actualite
                  agent.get('/api/actualites/' + actualiteSaveRes.body._id)
                    .expect(200)
                    .end(function (actualiteInfoErr, actualiteInfoRes) {
                      // Handle actualite error
                      if (actualiteInfoErr) {
                        return done(actualiteInfoErr);
                      }

                      // Set assertions
                      (actualiteInfoRes.body._id).should.equal(actualiteSaveRes.body._id);
                      (actualiteInfoRes.body.title).should.equal(actualite.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (actualiteInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Actualite.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
