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
describe('Actualite Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an actualite if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new actualite
        agent.post('/api/actualites')
          .send(actualite)
          .expect(200)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Handle actualite save error
            if (actualiteSaveErr) {
              return done(actualiteSaveErr);
            }

            // Get a list of actualites
            agent.get('/api/actualites')
              .end(function (actualitesGetErr, actualitesGetRes) {
                // Handle actualite save error
                if (actualitesGetErr) {
                  return done(actualitesGetErr);
                }

                // Get actualites list
                var actualites = actualitesGetRes.body;

                // Set assertions
                (actualites[0].user._id).should.equal(userId);
                (actualites[0].title).should.match('Actualite Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an actualite if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new actualite
        agent.post('/api/actualites')
          .send(actualite)
          .expect(200)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Handle actualite save error
            if (actualiteSaveErr) {
              return done(actualiteSaveErr);
            }

            // Update actualite title
            actualite.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing actualite
            agent.put('/api/actualites/' + actualiteSaveRes.body._id)
              .send(actualite)
              .expect(200)
              .end(function (actualiteUpdateErr, actualiteUpdateRes) {
                // Handle actualite update error
                if (actualiteUpdateErr) {
                  return done(actualiteUpdateErr);
                }

                // Set assertions
                (actualiteUpdateRes.body._id).should.equal(actualiteSaveRes.body._id);
                (actualiteUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an actualite if no title is provided', function (done) {
    // Invalidate title field
    actualite.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new actualite
        agent.post('/api/actualites')
          .send(actualite)
          .expect(422)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Set message assertion
            (actualiteSaveRes.body.message).should.match('Title cannot be blank');

            // Handle actualite save error
            done(actualiteSaveErr);
          });
      });
  });

  it('should be able to delete an actualite if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new actualite
        agent.post('/api/actualites')
          .send(actualite)
          .expect(200)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Handle actualite save error
            if (actualiteSaveErr) {
              return done(actualiteSaveErr);
            }

            // Delete an existing actualite
            agent.delete('/api/actualites/' + actualiteSaveRes.body._id)
              .send(actualite)
              .expect(200)
              .end(function (actualiteDeleteErr, actualiteDeleteRes) {
                // Handle actualite error error
                if (actualiteDeleteErr) {
                  return done(actualiteDeleteErr);
                }

                // Set assertions
                (actualiteDeleteRes.body._id).should.equal(actualiteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single actualite if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new actualite model instance
    actualite.user = user;
    var actualiteObj = new Actualite(actualite);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new actualite
        agent.post('/api/actualites')
          .send(actualite)
          .expect(200)
          .end(function (actualiteSaveErr, actualiteSaveRes) {
            // Handle actualite save error
            if (actualiteSaveErr) {
              return done(actualiteSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (actualiteInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
