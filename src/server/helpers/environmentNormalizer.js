const LOCAL_KEY = 'local';
const DEV_KEY = 'dev';
const QA_KEY = 'qa';
const STG_KEY = 'stg';
const PROD_KEY = 'prod';

const validEnvironments = {
  loc: LOCAL_KEY,
  local: LOCAL_KEY,
  ci: DEV_KEY,
  dev: DEV_KEY,
  development: DEV_KEY,
  qa: QA_KEY,
  stg: STG_KEY,
  stage: STG_KEY,
  prod: PROD_KEY,
  production: PROD_KEY
};

module.exports = {
  normalize: normalize
};

function normalize(val) {
  return validEnvironments[(val || '').toLowerCase()] || validEnvironments.prod;
}
