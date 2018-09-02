// students-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const students = new Schema(
    {
      facebookId: { type: String, unique: true, sparse: true },
      phone: { type: String, unique: true, sparse: true },

      password: { type: String },
      name: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

  return mongooseClient.model('students', students);
};
