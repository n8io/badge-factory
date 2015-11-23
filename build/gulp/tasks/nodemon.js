module.exports = function(gulp, plugins, cfg) {
  const opts = cfg.nodemon;

  opts.tasks = ['lint'];

  gulp.task('nodemon', nodemon);

  function nodemon() {
    const monitor = plugins.nodemon(opts);

    // Required to handle bug when attempting to quit with Cmd + C
    monitor.on('quit', function() {
      process.exit();
    });
  }
};
