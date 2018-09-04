// course-ads-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const courseAds = new Schema(
    {
      text: { type: String, required: true },
    },
    {
      timestamps: true,
      collection: 'course-ads',
    }
  );

  return mongooseClient.model('courseAds', courseAds);
};
