const path = require('path');
const projRoot = process.env.PWD;

module.exports = function(gulp, plugins, cfg) {
  gulp.task('eslint', eslint);

  function eslint() {
    const customGulpFormatter = require(path.join(projRoot, 'build/eslint/customGulpFormatter'));

    return gulp.src(cfg.eslint.src)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format(customGulpFormatter))
      .pipe(plugins.eslint.failAfterError())
      ;
  }
};
