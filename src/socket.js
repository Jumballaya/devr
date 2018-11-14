/**
 * Web Socket Server
 */
const setupServer = wss => {
  wss.on('connection', ws => {
    ws.on('message', console.log);
    ws.send(
      JSON.stringify({
        message: 'Connected to the development server',
        command: 'MESSAGE',
      })
    );
  });
};

module.exports = setupServer;
