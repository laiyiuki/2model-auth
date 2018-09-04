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
  isNot,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const { isAction } = require('../../hooks');
const {
  constructPhone,
  isNewUser,
  processDataFromFacebook,
  verifyOneTimeToken,
} = require('./hooks/before');
const { requestSMSVerifyCode } = require('./hooks/after');

module.exports = {
  before: {
    all: [paramsFromClient('action')],
    find: [
      ctx => console.log('ctx.params', ctx.params),

      iff(isProvider('external'), [
        iff(isNot(isAction('phone-sign-up')), authenticate('jwt')),
      ]),
    ],
    get: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        restrictToOwner({ ownerField: '_id' }),
      ]),
    ],
    create: [
      disableMultiItemCreate(),
      iffElse(
        isAction('facebook-sign-up'),
        [processDataFromFacebook()],
        [constructPhone(), isNewUser(), verifyOneTimeToken(), hashPassword()]
      ),
    ],
    update: [disallow()],
    patch: [
      iff(isProvider('external'), authenticate('jwt')),
      disableMultiItemChange(),
    ],
    remove: [disallow()],
  },

  after: {
    all: [protect('password')],
    find: [
      iff(isAction('phone-sign-up'), [
        requestSMSVerifyCode(),
        keep('_id', 'createdAt'),
      ]),
    ],
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
