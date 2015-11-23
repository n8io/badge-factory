'use strict';

/*
  The Bower Component Parser is a module that parses the bower_components directory and tries
  to build out an array of necessary files automatically. Helps prevent you from listing out
  every file explicitly that you want moved to your statics directory.
*/

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require('glob-all');
const projRoot = process.env.PWD;

module.exports = {
  parse: parse
};

function parse(bowerComponentsRelativeToProjRootPath) {
  const commonDistDirs = [
    'dist',
    'min',
    'lib',
    'release'
  ];

  let files = [];
  let fsObjs;
  let tPath;
  let topLevelDirectories;
  let tFiles;

  if (!bowerComponentsRelativeToProjRootPath) {
    return files;
  }

  topLevelDirectories = getDirectories(path.join(projRoot, bowerComponentsRelativeToProjRootPath));

  _.each(topLevelDirectories, function(tld) {
    tFiles = [];

    _.each(commonDistDirs, function(dir) {
      tPath = path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, dir, '**');
      fsObjs = glob.sync(tPath);

      _.each(fsObjs, function(f) {
        if (fs.lstatSync(f).isDirectory()) {
          return;
        }

        tFiles.push(f);
      });
    });

    if (!tFiles.length) {
      tFiles = glob.sync([
        // Since the tld doesn't have any specific build dir, grab everything
        path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, '**'),

        // Now pull out files that we know for sure are not to be available on the client
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, '**.json')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, '**.md')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, '**/test/**')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, 'LICENSE')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, '*runtfile.js')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, '**grunt.js')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, 'package.js')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, 'package.json')}`,
        `!${path.join(projRoot, bowerComponentsRelativeToProjRootPath, tld, 'index.js')}`
      ]);

      tFiles = _.reject(tFiles, function(f) {
        return fs.lstatSync(f).isDirectory();
      });
    }

    files = files.concat(tFiles);
  });

  return files;

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }
}
