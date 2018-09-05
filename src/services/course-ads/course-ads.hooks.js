const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  disallow,
  discard,
  disableMultiItemChange,
  disableMultiItemCreate,
  fastJoin,
  iff,
  iffElse,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  serialize,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const {
  restrictToOwner,
  associateCurrentUser,
} = require('feathers-authentication-hooks');

const {
  isAuthenticated,
  isPlatform,
  refreshParamsEntity,
  setFastJoinQuery,
} = require('../../hooks');

const resolvers = require('./resolvers');
const schema = require('./schema');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        isPlatform('teacher'),
        restrictToOwner({ idField: '_id', ownerField: 'teacherId' }),
      ]),
    ],
    create: [
      disableMultiItemCreate(),
      iff(isProvider('external'), [
        authenticate('jwt'),
        isPlatform('teacher'),
        associateCurrentUser({ idField: '_id', as: 'teacherId' }),
      ]),
    ],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      iff(isProvider('external'), [
        authenticate('jwt'),
        isPlatform('teavcher'),
        restrictToOwner({ idField: '_id', ownerField: 'teacherId' }),
      ]),
    ],
    remove: [disallow()],
  },

  after: {
    all: [
      iff(isAuthenticated(), [
        iff(isPlatform('student'), refreshParamsEntity('student')),
      ]),
      fastJoin(resolvers, setFastJoinQuery()),
      // iff(isAuthenticated(), [
      //   iff(isPlatform('student'), [
      //     getLatestStudentProfile(),
      //     serialize(schema),
      //   ]),
      // ]),
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
