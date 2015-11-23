module.exports = function(gulp, plugins, cfg) {
  gulp.task('test-unit', testUnit);

  function testUnit() {
    return gulp.src(cfg.test.unit.src)
      .pipe(plugins.mocha())
      .once('error', function() {
        process.exit(1);
      })
      .once('end', function() {
        process.exit();
      })
      ;
  }
};
