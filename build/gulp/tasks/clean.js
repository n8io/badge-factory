const del = require('del');

module.exports = function(gulp, plugins, cfg) {
  gulp.task('clean', clean);

  function clean(cb) {
    del.sync(cfg.clean.src);

    return cb();
  }
};
