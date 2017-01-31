const http = require('http');
const WsServer = require('ws').Server;

module.exports = function createMockServer() {
  let body = '';
  const server = http.createServer();

  const handler = (req, res) => {
    req.on('data', (d) => { body += d.toString(); });
    req.on('end', () => {
      server.emit(
        '__intercept',
        req,
        body.length > 0 ? JSON.parse(body) : null
      );
      body = '';
      res.end({});
    });
  };
  const wss = new WsServer({ server });
  server.on('request', handler);

  wss.on('connection', (ws) => {
    server.emit('__intercept', { url: ws.upgradeReq.url });
    ws.send(JSON.stringify({}));
    ws.close();
  });

  server.test = (cb) => {
    server.once('__intercept', cb);
  };
  return server;
};
