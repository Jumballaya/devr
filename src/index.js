/**
 * Dev Server
 */
const http = require('http');
const opn = require('opn');
const WebSocket = require('ws');

const router = require('./router');
const setupSocket = require('./socket');
const fileWatcher = require('./fileWatcher');

/**
 * Server
 *
 * Server takes a host, port and the current directory where the command was ran.
 */
function Server(host, port, open, pwd) {
  // Create an opts object for internal use
  const opts = {
    host,
    port,
    open,
    pwd,
  };

  // Create an http.server instance
  const server = http.createServer(router(opts));

  // Set up websocket listener
  const wss = new WebSocket.Server({ server });
  setupSocket(wss);

  const listen = msg => {
    server.listen(opts.port, opts.host, () => {
      // Write message
      process.stdout.write(`${msg}\n`);

      // Watch files and broadcast changes
      fileWatcher(pwd, fp => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ path: fp, command: 'RELOAD' }));
          }
        });
      });

      // Open browser
      if (opts.open) {
        opn(`http://${opts.host}:${opts.port}`);
      }
    });
  };

  return {
    listen,
  };
}

module.exports = Server;
