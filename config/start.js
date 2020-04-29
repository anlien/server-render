const spawn = require('cross-spawn');
// const chalk = require('chalk');

spawn('babel', ['src', '--out-dir', 'dist'], { stdio: 'inherit' });

