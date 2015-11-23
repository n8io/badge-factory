module.exports = function(gulp, plugins, cfg) {
  gulp.task('coverage', coverage);

  function coverage(cb) {
    gulp
      .src(cfg.coverage.src)
      .pipe(plugins.istanbul(cfg.coverage.options))
      .pipe(plugins.istanbul.hookRequire())
      .on('finish', function() {
        gulp
          .src(cfg.test.all.src)
          .pipe(plugins.mocha())
          .pipe(plugins.istanbul.writeReports(cfg.coverage.writeReportsOptions))
          .pipe(plugins.istanbul.enforceThresholds(cfg.coverage.thresholdOptions))
          .on('end', function() {
            process.exit();

            return cb();
          })
          ;
      })
      ;
  }
};
