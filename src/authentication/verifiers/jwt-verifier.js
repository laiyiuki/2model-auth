const { Verifier } = require('@feathersjs/authentication-jwt');

class JwtVerifier extends Verifier {
  // The verify function has the exact same inputs and
  // return values as a vanilla passport strategy
  async verify(req, payload, done) {
    const app = this.app;
    const { platform } = payload;
    const id = payload[`${platform}Id`];
    // this.service = app.service(`${platform}s`);
    try {
      const user = await app.service(`${platform}s`).get(id);
      // const newPayload = { [`${platform}Id`]: user._id, platform };

      done(null, user, payload);
    } catch (err) {
      done(err);
    }
  }
}

module.exports = JwtVerifier;
