# badge-factory
A simple api to build out a custom badge.

* Tech Stack
  * [StackShare](https://stackshare.io) [![Stack Share](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/n8io/badge-factory)
* Requirements
  * [NodeJs](https://nodejs.org) ![NodeJs Version](http://img.shields.io/badge/node-^5-blue.svg)
* Builds
  * [Travis CI](https://travis-ci.org) [![Travis CI Build Status](https://img.shields.io/travis/n8io/badge-factory/develop.svg)](https://travis-ci.org/n8io/badge-factory)
  * [Circle CI](https://circleci.com) [![Circle CI Build Status](https://img.shields.io/circleci/project/n8io/badge-factory/develop.svg)](https://circleci.com/gh/n8io/badge-factory/tree/develop)
  * [Codeship](https://codeship.com) [![Codeship CI Build Status](https://img.shields.io/codeship/49f0dc00-79d1-0133-5008-7addd7fed507/develop.svg)](https://codeship.com/projects/116268)
* Dependencies
  * [David DM](https://david-dm.org) ![NPM Dependencies](https://david-dm.org/n8io/badge-factory/develop.svg)
  * [bitHound](https://bithound.io) [![bitHound Dependencies](https://www.bithound.io/github/n8io/badge-factory/badges/dependencies.svg)](https://www.bithound.io/github/n8io/badge-factory/develop/dependencies/npm)
* Code Coverage
  * [Coveralls](https://coveralls.io) [![Coverage Status](https://img.shields.io/coveralls/n8io/badge-factory/develop.svg)](https://coveralls.io/github/n8io/badge-factory?branch=develop)
  * [CodeCov](https://codecov.io) [![CodeCov Code Coverage](https://img.shields.io/codecov/c/github/n8io/badge-factory/develop.svg)](https://codecov.io/github/n8io/badge-factory?branch=develop)
* Code Health
  * [bitHound](https://bithound.io) [![bitHound Score](https://www.bithound.io/github/n8io/badge-factory/badges/score.svg)](https://www.bithound.io/github/n8io/badge-factory)


## Getting started
1. `npm install`

## Developing
1. `npm run dev`

## Code Coverage
1. `npm run coverage`

## Code Linting
1. `npm run lint`

## Docker

### Prerequisites
1. Make sure you have the latest Docker Toolbox installed.
1. Make sure you have ran `npm install`

### Dockerizing
1. `npm run build:docker && npm run docker`
1. `open http://$(docker-machine ip <YOUR_DOCKER_MACHINE_NAME>)`
1. You should see `Hello world!`

View [change log](CHANGELOG.md)
