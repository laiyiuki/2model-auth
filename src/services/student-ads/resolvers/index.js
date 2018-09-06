const resolvers = {
  joins: {
    student: (...args) => async (studentAd, context) => {
      return (studentAd.student = await context.app
        .service('students')
        .get(studentAd.studentId, {
          query: {
            // $select: { password: 0 },
          },
          fastJoinQuery: undefined,
        }));
    },
    bookmarked: () => async (studentAd, context) => {
      const { user, payload } = context.params;

      if (
        payload &&
        payload.platform === 'student' &&
        user &&
        user.bookmarks &&
        user.bookmarks.filter(id => studentAd._id.equals(id)).length
      ) {
        return (studentAd.bookmarked = true);
      }

      return (studentAd.bookmarked = undefined);
    },
  },
};

module.exports = resolvers;
