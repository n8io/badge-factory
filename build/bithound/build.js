const fs = require('fs');
const path = require('path');
const projRoot = process.env.PWD;
const srcPath = path.join(__dirname, '.bithoundrc');
const destPath = path.join(projRoot, '.bithoundrc');

fs.createReadStream(srcPath).pipe(fs.createWriteStream(destPath));
