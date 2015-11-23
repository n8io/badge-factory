'use strict';

const _ = require('lodash');

module.exports = function(gulp, plugins, cfg) {
  gulp.task('stylint', stylint);

  let summary = [];

  function stylint() {
    if (cfg.env !== 'local') {
      plugins.util.log(plugins.util.colors.yellow('stylint skipped (NODE_ENV !== "local")'));

      return;
    }

    return gulp
      .src(cfg.stylint.src)
      .pipe(plugins.stylint(cfg.stylint.options, logOutput))
      .on('end', function() {
        formatStylintingResults(summary);
      })
      ;

    function formatStylintingResults(fileOutputs) {
      let errCount = 0;
      let warnCount = 0;

      _.each(fileOutputs, function(outputs) {
        const filePath = _.first(outputs, {path: true}).path;
        const errors = _.chain(outputs).filter({type: 'error'}).sortBy('line').value();
        const warnings = _.chain(outputs).filter({type: 'warning'}).sortBy('line').value();

        plugins.util.log('');
        plugins.util.log(
            plugins.util.colors.cyan('  File'),
            filePath,
            plugins.util.colors.yellow(`${warnings.length} warnings`),
            '/',
            plugins.util.colors.red(`${errors.length} errors`)
          )
          ;

        _.each(warnings, function(w) {
          plugins.util.log(
              '    ',
              plugins.util.colors.yellow(w.message),
              `: ${w.hint}`,
              plugins.util.colors.gray(`: ${w.lineNo}`)
            )
            ;
        });

        _.each(errors, function(e) {
          plugins.util.log(
              plugins.util.colors.red('    stylint'),
              e.message,
              `: ${e.hint}`,
              plugins.util.colors.gray(`(line ${e.lineNo})`)
            )
            ;
        });

        errCount += errors.length;
        warnCount += warnings.length;
      });

      const warningsAndErrorsCount = warnCount + errCount;

      if (warningsAndErrorsCount > 0) {
        plugins.util.log('');
        plugins.util.log(
          plugins.util.colors.italic('  Stylint summary'),
          plugins.util.colors.yellow(`${warnCount} warnings`),
          '/',
          plugins.util.colors.red(`${errCount} errors`)
        );
        plugins.util.log('');
      }

      summary = [];
    }

    function parseMessageToObject(msg) {
      const data = [];
      const validTypes = {
        warning: 'warning',
        error: 'error',
        file: 'file',
        line: 'line',
        stylint: 'summary',
        summary: 'summary',
        unknown: 'unknown'
      };

      let output = {};
      let parts;
      let type;
      let lines = msg.split('\n');

      lines = _.filter(lines, function(line) {
        return !!line;
      });

      _.each(lines, function(line, index) { // eslint-disable-line
        let infos = [];

        parts = line.split(':');

        parts = _.map(parts, function(part) {
          return _.trim(part);
        });

        type = validTypes[parts[0].toLowerCase()] || validTypes.unknown;

        switch (type) {
          case validTypes.warning:
            output = {
              type: validTypes.warning,
              message: _.capitalize(parts[1])
            };
            break;
          case validTypes.error:
            output = {
              type: validTypes.error,
              message: parts[1]
            };
            break;
          case validTypes.file:
            output.path = parts[1];
            break;
          case validTypes.line:
            output.lineNo = parseInt(parts[1], 10);
            output.hint = parts[2];
            data.push(output);
            break;
          case validTypes.stylint:
          case validTypes.summary:
            infos = parts[1].split('.').join('').split(' ');

            output = {
              type: validTypes.summary,
              summaryType: infos[1].toLowerCase(),
              count: parseInt(infos[0], 10)
            };

            data.push(output);
            break;
          default:
            break;
        }
      });

      return data;
    }

    function logOutput(msg) {
      summary.push(parseMessageToObject(msg));
    }
  }
};
