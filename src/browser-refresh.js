/**
 * Browser Refresh Script
 */

module.exports = (host, port) => `

const shouldReload = path => {
  const url = location.pathname;
  const formatted = '/' + path.replace('index.html', '').replace('.html', '');
  return formatted === url;
};

const socket = new WebSocket("ws://${host}:${port}");
socket.onmessage = evt => {
  const opts = JSON.parse(evt.data);

  switch (opts.command) {
    case 'RELOAD':
      if (shouldReload(opts.path))
        window.setTimeout(() => { location.reload(); }, 200);
      break;
    case 'MESSAGE':
      console.log(opts.message);
      break;
    default:
      console.log(opts);
  }

};
socket.onopen = () => {
  socket.send(JSON.stringify({ message: 'Browser connected', command: 'MESSAGE' }));
};
`;
