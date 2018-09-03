const students = require('./students/students.service.js');
const teachers = require('./teachers/teachers.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(students);
  app.configure(teachers);
};
