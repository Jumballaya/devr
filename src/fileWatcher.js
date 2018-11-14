/**
 * File Watcher
 */
const chokidar = require('chokidar');

// File Watcher
const fileWatcher = (fp, cb) =>
  chokidar.watch('.', { ignored: /(^|[\/\\])\../ }).on('all', (_, p) => cb(p));

module.exports = fileWatcher;
