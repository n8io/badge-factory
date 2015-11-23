const fs = require('fs');
const path = require('path');
const projRoot = process.env.PWD;
const srcPath = path.join(__dirname, '.stylintrc');
const destPath = path.join(projRoot, '.stylintrc');

fs.createReadStream(srcPath).pipe(fs.createWriteStream(destPath));
