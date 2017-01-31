const http = require('http');

module.exports = function createMockServer() {
  let body = '';
  const server = http.createServer((req, res) => {
    req.on('data', (d) => { body += d.toString(); });
    req.on('end', () => {
      server.emit(
        '__intercept',
        req,
        body.length > 0 ? JSON.parse(body) : null
      );
      body = '';
      res.end();
    });
  });

  server.test = (cb) => {
    server.once('__intercept', cb);
  };
  return server;
};
