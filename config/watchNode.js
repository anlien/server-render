const chokidar = require('chokidar');

// One-liner for current directory
// Initialize watcher.
const watcher = chokidar.watch('../src', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

const log = console.log.bind(console);

// Add event listeners.
watcher.on('add', path => log(`File ${path} has been added`))
    .on('change', path => log(`File ${path} has been changed`))
    .on('unlink', path => log(`File ${path} has been removed`));