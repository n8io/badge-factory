const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const _ = require('lodash');
const shell = require('shelljs');
const io = require('inquirer');
const request = require('request');

const gitCurrentBranchNameCmd = `git rev-parse --abbrev-ref HEAD`;
const currentBranchName = shell.exec(gitCurrentBranchNameCmd, {silent: true}).output.split('\n')[0];
const issueNoReg = /\/(\d+)-(.*)/i;
const matches = currentBranchName.match(issueNoReg) || [];
const defaultIssueNo = matches.length > 1 ? matches[1] : null;
const questions = [];

_.str = require('underscore.string');

// Split logic on Issue No
questions.push({
  type: 'confirm',
  name: 'isIssuePR',
  message: 'Would you like to link this pull request to an issue?',
  'default': true
});

// Enter issue number
questions.push({
  type: 'input',
  name: 'issueNo',
  message: 'What is the issue number that this pull request relates to?',
  'default': defaultIssueNo,
  validate: function(input) {
    const done = this.async();

    if (isNaN(input)) {
      return done('You need to provide a valid issue number');
    }

    return done(true);
  },
  filter: function(input) {
    return parseInt(input, 0);
  },
  when: function(answers) {
    return answers.isIssuePR;
  }
});

// Select Branch
questions.push({
  type: 'list',
  name: 'toBranch',
  message: 'Which branch will you be merging to?',
  'default': 'develop',
  choices: function() {
    const gitBranchListCmd = `git for-each-ref --count=20 --sort=-committerdate refs/heads/ --format='%(refname:short)'`;
    const gitBranchListOutput = shell.exec(gitBranchListCmd, {silent: true}).output.split('\n');
    const branches = _
      .chain(gitBranchListOutput)
      .filter(function(line) {
        return !!line && line !== currentBranchName;
      })
      .map(function(line) {
        return line.trim();
      })
      .value();

    return branches;
  }
});

// Filter messages for PR
questions.push({
  type: 'checkbox',
  name: 'messages',
  message: 'Choose which messages you want in the description of the pull request?',
  choices: function(answers) {
    const numberOfMessagesLookback = 15;
    const toBranch = answers.toBranch;
    const gitMessagesCmd = `git log -${numberOfMessagesLookback} --pretty=%B ${toBranch}..${currentBranchName}`;
    const gitMessagesOutput = shell.exec(gitMessagesCmd, {silent: true}).output.split('\n');
    const messages = _
      .chain(gitMessagesOutput)
      .filter(function(line) {
        return !!line;
      })
      .map(function(line) {
        return line;
      })
      .value();

    return _.map(messages, function(msg) {
      return {name: msg, checked: true};
    });
  }
});

// Add a title
questions.push({
  type: 'input',
  name: 'title',
  message: 'Please enter the title of this pull request:',
  'default': function(answers) {
    const dasherizedTitle = matches[2] || null;
    const defaultTitle = _.str.humanize(dasherizedTitle);

    if (!defaultTitle && answers.messages.length) {
      return answers.messages[0];
    }

    return defaultTitle || `Pull request to merge ${currentBranchName} to ${answers.toBranch}`;
  },
  validate: function(input) {
    return typeof input !== undefined && !!input.trim();
  },
  filter: function(input) {
    return input.trim();
  },
  when: function(answers) {
    return !answers.isIssuePR;
  }
});

// Prompt for custom message
questions.push({
  type: 'confirm',
  name: 'hasAdditionalMessage',
  message: 'Would you like to append a custom message?',
  'default': false
});

// Enter custom message
questions.push({
  type: 'input',
  name: 'additionalMessage',
  message: 'Please enter your custom message:',
  when: function(answers) {
    return answers.hasAdditionalMessage;
  }
});

// Double-check
questions.push({
  type: 'confirm',
  name: 'isOK',
  message: function(answers) {
    const data = getDataFromAnswers(answers);

    return `Everything look good?\n${chalk.green(JSON.stringify(data, null, 2))}`;
  }
});

io.prompt(questions, onQuestionsEntered);

function onQuestionsEntered(answers) {
  if (!answers.isOK) {
    console.log(chalk.red('Pull request aborted.')); // eslint-disable-line
    process.exit(1);

    return;
  }

  createPullRequest(answers, getUserToken());
}

function getDataFromAnswers(answers) {
  const data = {};

  if (answers.isIssuePR) {
    data.issueNo = answers.issueNo;
  }
  else {
    data.title = answers.title;
  }

  data.fromBranch = currentBranchName;
  data.toBranch = answers.toBranch;
  data.messages = answers.messages;

  if (answers.hasAdditionalMessage && answers.additionalMessage) {
    data.customMessage = answers.additionalMessage;
  }

  return data;
}

function getPullRequestBody(answers) {
  const aData = getDataFromAnswers(answers);
  const messages = aData.messages.map(function(msg) {
    return `* ${msg}`;
  });
  const data = {};

  if (messages.length > 1) {
    messages.splice(0, 0, 'Changes include:');
  }

  if (aData.customMessage) {
    messages.push('');
    messages.push(aData.customMessage);
  }

  messages.push('');
  messages.push(`Related to issue: #${aData.issueNo}`);

  if (aData.title) {
    data.title = aData.title;
  }
  else {
    data.issue = aData.issueNo;
  }

  data.head = aData.fromBranch;
  data.base = answers.toBranch;
  data.body = messages.join('\n');

  return data;
}

function getUserToken() {
  const prTokenPath = path.join(os.homedir(), '.pull-request');

  if (!fs.existsSync(prTokenPath)) {
    return null;
  }

  return fs.readFileSync(prTokenPath, 'utf-8').toString();
}

function createPullRequest(answers, token) {
  const gitRepoNameCmd = `git config --get remote.origin.url`;
  const gitRepoNameOutput = shell.exec(gitRepoNameCmd, {silent: true}).output.split('\n')[0];
  const repoReg = /^.*\.com:(.+)+.git?$/i;
  const repo = gitRepoNameOutput.match(repoReg)[1];
  const createUrl = `https://api.github.com/repos/${repo}/pulls`;
  const data = getPullRequestBody(answers);
  const reqOpts = {
    method: 'POST',
    uri: createUrl,
    headers: {
      'User-Agent': repo,
      'Authorization': `token ${token}`
    },
    json: true,
    body: data
  };

  if (!token) {
    console.log(chalk.red('Auth token file at "~/.pull-request" is required to create pull requests.')); // eslint-disable-line no-console
    process.exit(1);

    return;
  }

  request(reqOpts, function(err, results) {
    if (err) {
      throw err;
    }
    else if (results && results.statusCode !== 201) {
      return console.log( // eslint-disable-line no-console
        chalk.red(`There was a problem creating your pull request:\n${JSON.stringify(results.body, null, 2)}`)
      );
    }

    console.log(chalk.green(`Successfully create pull request: #${results.body.id} ${results.body.title}`)); // eslint-disable-line no-console
    console.log(chalk.gray(`open ${results.body.html_url} # Run this to command view`)); // eslint-disable-line no-console
  });
}
