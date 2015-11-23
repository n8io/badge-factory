'use strict';

const _ = require('lodash');
const util = require('gulp-util');

module.exports = parseResults;

function parseResults(results) {
  let summaryMsg = '';
  const summary = {
    errors: _.sum(results, function(info) {
      return info.errorCount;
    }),
    warnings: _.sum(results, function(info) {
      return info.warningCount;
    })
  };

  if (!summary.errors && !summary.warnings) {
    return; // Nothing to report
  }

  const fileResults = _.filter(results, function(obj) {
    return obj.errorCount || obj.warningCount;
  });

  util.log('');

  _.each(fileResults, function(file) {
    reportFilename(file.filePath, file.errorCount, file.warningCount);

    _.each(file.messages, function(msg) {
      switch (msg.severity) {
        case 1:
          reportWarning(msg);
          break;
        case 2:
          reportError(msg);
          break;
        default:
          break;
      }
    });

    util.log('');
  });

  if (summary.warnings) {
    summaryMsg += util.colors.yellow(`${summary.warnings} warnings. `);
  }

  if (summary.errors) {
    summaryMsg += util.colors.red(`${summary.errors} errors. `);
  }

  if (summaryMsg) {
    util.log(`  ESLint summary: ${summaryMsg}`);
    util.log('');
  }
}

function reportFilename(filePath, errorCount, warningCount) {
  util.log(
      util.colors.cyan(`  File ${filePath}`),
      util.colors.yellow(`${warningCount} warnings`),
      '/',
      util.colors.red(`${errorCount} errors`)
    )
    ;
}

function reportError(message) {
  util.log(
      `    `,
      util.colors.red(`${message.message} [${message.ruleId}]`),
      `: ${message.source}`,
      util.colors.gray(`${message.line}:${message.column}`)
    )
    ;
}

function reportWarning(message) {
  util.log(
      `    `,
      util.colors.yellow(`${message.message} [${message.ruleId}]`),
      `: ${message.source}`,
      util.colors.gray(`${message.line}:${message.column}`)
    )
    ;
}
