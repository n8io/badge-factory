const fs = require('fs');
const path = require('path');
const projRoot = process.env.PWD;
const srcBowerRcPath = path.join(__dirname, '.bowerrc');
const destBowerRcPath = path.join(projRoot, '.bowerrc');

fs.createReadStream(srcBowerRcPath).pipe(fs.createWriteStream(destBowerRcPath));
