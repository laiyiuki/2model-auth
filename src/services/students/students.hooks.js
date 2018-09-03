const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword,
  protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  // actOnDispatch,
  // alterItems,
  discard,
  disableMultiItemChange,
  disableMultiItemCreate,
  disablePagination,
  disallow,
  iff,
  iffElse,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const processDataFromFacebook = require('./hooks/before/process-data-from-facebook');

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), authenticate('jwt')),
      // ctx => console.log('params.user', ctx.params.user),
    ],
    get: [],
    create: [
      processDataFromFacebook(),
      // iffElse(
      //   isFacebookSignUp(),
      //   [processDataFromFacebook()],
      //   [constructPhone(), isNewUser(), verifyOneTimeToken(), hashPassword()],
      // ),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [protect('password')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
