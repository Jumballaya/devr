#!/usr/bin/env node

const path = require('path');
const program = require('commander');

const DevServer = require('./src');

/**
 * Initialize CLI
 */
const init = () => {
  program
    .version('0.1.0', '-v, --version')
    .description('Easy to add (and remove) development environment')
    .usage('<host> <port> <open>')
    .option(
      '-hn, --host <string>',
      'Host name that runs the server',
      'localhost'
    )
    .option('-p, --port <number>', 'Port to run the server on', 8080)
    .option('-o, --open', 'Opens the browser up to the dev server', false);
};

/**
 * Program Entry
 */
const entry = argv => {
  init();
  program.parse(argv);
  const { host, port, open } = program;
  const currentDir = path.resolve('./');

  const server = new DevServer(host, port, open, currentDir);
  server.listen(`Dev server listening on port ${port}`);
};

// Run Program
entry(process.argv);
