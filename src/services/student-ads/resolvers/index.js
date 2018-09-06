const resolvers = {
  joins: {
    teacher: (...args) => async (courseAd, context) => {
      return (courseAd.teacher = await context.app
        .service('teachers')
        .get(courseAd.teacherId, {
          query: {
            // $select: { password: 0 },
          },
          fastJoinQuery: undefined,
        }));
    },
    bookmarked: () => async (courseAd, context) => {
      const { user, payload } = context.params;

      if (
        payload &&
        payload.platform === 'student' &&
        user &&
        user.bookmarks &&
        user.bookmarks.filter(id => courseAd._id.equals(id)).length
      ) {
        return (courseAd.bookmarked = true);
      }

      return (courseAd.bookmarked = undefined);
    },
  },
};

module.exports = resolvers;
