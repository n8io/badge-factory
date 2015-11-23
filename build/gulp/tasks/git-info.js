const fs = require('fs');
const shell = require('shelljs');

module.exports = function(gulp, plugins, cfg) { // eslint-disable-line no-unused-vars
  gulp.task('git-info', gitInfo);

  function gitInfo() {
    const git = {
      commit: (shell.exec('git rev-parse --verify HEAD', {silent: true}).output || '').split('\n').join(''),
      branch: (shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).output || '').split('\n').join('')
    };

    fs.writeFileSync(cfg['git-info'].dest, JSON.stringify(git, null, 2));
  }
};
