const path = require('path');
const shell = require('shelljs');
const projRoot = path.join(process.env.PWD);
const buildDir = path.join(projRoot, 'build');
const srcDir = path.join(projRoot, 'src');
const testDir = path.join(projRoot, 'test');
const distDir = path.join(projRoot, 'dist');
const packageJson = require(path.join(projRoot, 'package.json'));
const envNormalizer = require(path.join(projRoot, 'src/server/helpers/environmentNormalizer'));
const cfg = {
  env: envNormalizer.normalize(process.env.NODE_ENV || 'local'),
  stylint: {
    src: [
      path.join(srcDir, 'app/client/**/*.styl')
    ]
  },
  clean: {
    src: [
      distDir
    ]
  },
  coverage: {
    src: [
      'src/**/*.js'
    ],
    options: {
      includeUntested: true
    },
    writeReportsOptions: {
      reporters: [
        'html',
        'lcov',
        'json',
        'text'
      ]
    },
    thresholdOptions: {
      thresholds: {
        global: {
          statements: 95,
          branches: 85,
          functions: 90,
          lines: 95
        },
        each: {
          statements: 90,
          branches: 70,
          lines: -20
        }
      }
    }
  },
  eslint: {
    src: [
      path.join(buildDir, '**/*.js'),
      path.join(srcDir, '**/*.js'),
      path.join(testDir, '**/*.js'),
      path.join(`!${srcDir}`, 'app/client/statics/**/*.js'),
      path.join(`!${projRoot}`, '**/*.min.js')
    ]
  },
  'git-info': {
    dest: path.join(projRoot, '.git.json')
  },
  nodemon: {
    script: path.join(projRoot, process.env['npm_package_main']),
    ext: 'js',
    ignore: [
      path.join(`!${buildDir}`, 'docker/**/*.js'),
      path.join(`!${srcDir}`, 'client/statics/**/*')
    ]
  },
  plato: {
    src: [
      path.join(projRoot, 'src/**/*.js')
    ],
    dest: path.join(projRoot, 'coverage/plato'),
    options: {
      title: `In-Depth Code Coverage for ${packageJson.name}`,
      date: (new Date()).getTime(),
      recurse: true
    }
  },
  test: {
    all: {
      src: [
        path.join(projRoot, 'test/test.spec.js')
      ],
      options: {
        reporter: 'spec',
        growl: true
      }
    },
    unit: {
      src: [
        path.join(projRoot, 'test/unit/unit.spec.js')
      ],
      options: {
        reporter: 'spec',
        growl: true
      }
    },
    integration: {
      src: [
        path.join(projRoot, 'test/integration/integration.spec.js')
      ],
      options: {
        reporter: 'spec',
        growl: true
      }
    }
  }
};

cfg.git = {
  commit: (shell.exec('git rev-parse --verify HEAD', {silent: true}).output || '').split('\n').join(''),
  branch: (shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).output || '').split('\n').join('')
};

module.exports = cfg;
