const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  disallow,
  // discard,
  disableMultiItemChange,
  disableMultiItemCreate,
  fastJoin,
  iff,
  isProvider,
  paramsFromClient,
  // preventChanges,
  // serialize,
} = require('feathers-hooks-common');
const {
  restrictToOwner,
  associateCurrentUser,
} = require('feathers-authentication-hooks');

const {
  // isAuthenticated,
  isPlatform,
  refreshParamsEntity,
  setFastJoinQuery,
} = require('../../hooks');

const resolvers = require('./resolvers');

module.exports = {
  before: {
    all: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        paramsFromClient('action'),
      ]),
    ],
    find: [],
    get: [
      iff(isProvider('external'), [
        isPlatform('student'),
        restrictToOwner({ idField: '_id', ownerField: 'studentId' }),
      ]),
    ],
    create: [
      disableMultiItemCreate(),
      iff(isProvider('external'), [
        isPlatform('student'),
        associateCurrentUser({ idField: '_id', as: 'studentId' }),
      ]),
    ],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      iff(isProvider('external'), [
        isPlatform('student'),
        restrictToOwner({ idField: '_id', ownerField: 'studentId' }),
      ]),
    ],
    remove: [disallow()],
  },

  after: {
    all: [
      iff(isPlatform('teacher'), refreshParamsEntity('teacher')),
      fastJoin(resolvers, setFastJoinQuery()),
    ],
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
