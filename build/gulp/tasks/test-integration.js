module.exports = function(gulp, plugins, cfg) {
  gulp.task('test-integration', testIntegration);

  function testIntegration() {
    return gulp.src(cfg.test.integration.src)
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
