module.exports = function(gulp, plugins) {
  const cfg = require('./config');

  // Register all tasks
  require('./tasks')(gulp, plugins, cfg);

  // Expose custom multi-tasks
  gulp.task('lint', plugins.sequence(['stylint', 'eslint']));
  gulp.task('default', plugins.sequence(['clean', 'lint', 'git-info'], 'nodemon'));
};
