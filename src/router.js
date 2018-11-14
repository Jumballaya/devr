/**
 * Router
 *
 * Handles the routing from an HTTP server
 */
const uri = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const refreshScript = require('./browser-refresh');

// Async fs.lstat
const fsLstat = fp =>
  new Promise((resolve, reject) =>
    fs.lstat(fp, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    })
  );

// Async fs.readFile
const fsReadFile = fp =>
  new Promise((resolve, reject) =>
    fs.readFile(fp, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  );

// Get File
const getFile = async (u, base) => {
  const url = uri.parse(u);

  const getPathName = async fp => {
    try {
      const stats = await fsLstat(fp);
      if (stats.isDirectory()) {
        return getPathName(`${fp}/index.html`);
      }
      return fp;
    } catch (e) {
      // pretty path to html file
      const pp = path.parse(fp);
      const pretty = `${pp.dir}/${pp.name}`.split(base)[1];
      if (pretty === u) {
        return getPathName(`${fp}.html`, u);
      }
    }
    return '';
  };

  const filepath = await getPathName(path.resolve(base + url.pathname));
  console.log('Request ', filepath);
  const data = await fsReadFile(filepath);
  return data;
};

// Router
const router = opts => (req, res) => {
  const u = req.url;
  const refresh = `<script>${refreshScript(opts.host, opts.port)}</script>`;
  getFile(u, opts.pwd)
    .then(data => {
      const ext = path.extname(u).replace('.', '');
      const type = mime.getType(ext);
      res.writeHead(200, { 'Content-Type': type });
      res.write(`${data} ${refresh}`);
      res.end();
    })
    .catch(err => {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write(`${refresh} <h1>Custom 404 page!</h1><pre>${err}</pre>`);
      res.end();
    });
};

module.exports = router;
