const authentication = require('@feathersjs/authentication');
const { protect } = require('@feathersjs/authentication-local').hooks;

const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');

const LocalVerifier = require('./verifiers/local-verifier');
const JwtVerifier = require('./verifiers/jwt-verifier');

module.exports = function(app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt({ Verifier: JwtVerifier }));
  app.configure(local({ Verifier: LocalVerifier }));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      // all: [ctx => console.log('before ctx.method', ctx.method)],
      create: [authentication.hooks.authenticate(config.strategies)],
      remove: [authentication.hooks.authenticate('jwt')],
    },
    after: {
      all: [
        // ctx => console.log('after ctx.params.payload', ctx.params.payload),
        //
      ],
      create: [
        ctx => {
          ctx.result.user = ctx.params.user;
        },
        protect('user.password'),
      ],
    },
  });
};
