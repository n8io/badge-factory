module.exports = function(gulp, plugins, cfg) {
  gulp.task('test', test);

  function test() {
    return gulp.src(cfg.test.all.src)
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
