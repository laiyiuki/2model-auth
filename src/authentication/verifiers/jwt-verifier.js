const { Verifier } = require('@feathersjs/authentication-jwt');

class JwtVerifier extends Verifier {
  // The verify function has the exact same inputs and
  // return values as a vanilla passport strategy
  async verify(req, payload, done) {
    const app = this.app;
    const { platform } = payload;
    console.log('req', req.body);
    console.log('payload', payload);

    if (!platform || !payload[`${platform}Id`]) {
      console.log('cas 1');

      return done(null, {}, payload);
    }

    const id = payload[`${platform}Id`];
    this.service = app.service(`${platform}s`);

    try {
      const user = await app.service(`${platform}s`).get(id);
      const newPayload = { [`${platform}Id`]: user._id, platform };
      console.log('case 2', user);

      return done(null, user, newPayload);
    } catch (err) {
      return done(err);
    }
  }
}

module.exports = JwtVerifier;
