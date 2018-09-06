const { getByDot } = require('feathers-hooks-common');

module.exports = function isPlatform(platform) {
  return context => {
    if (getByDot(context.params, 'payload.platform') === platform) {
      return context;
    }
  };
};
