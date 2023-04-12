const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');
const proxy = require('http2-proxy');
const logger = require("./logger");

// HTTPS configuration
const httpsConfig = {
  cert: readFileSync('./ssl/cert.pem'),
  key: readFileSync('./ssl/key.pem'),
  allowHTTP1: true
};

// Proxy map for routing requests
const proxyMap = {
  '/api': 'http://localhost:3000',
  '/spa': 'http://localhost:3001',
  '/oauth': 'http://localhost:3002',
  '/graph': 'http://localhost:3003',
  '/event': 'http://localhost:3004',
};

// Create HTTPS server
const server = createSecureServer(httpsConfig, onRequest).listen(8443);
console.log('Listening on https://localhost:8443');

// Request handler function
function onRequest(req, res) {
  const { method, url, headers, body } = req;
  logger.info({ method, url, headers, body });

  // Routing requests to the target server
  for (const path in proxyMap) {
    if (req.url.startsWith(path)) {
      const target = proxyMap[path];
      const [protocol, , hostname, port] = target.split(/:|\/\//g);
      proxy.web(req, res, { hostname, port});
      return;
    }
  }

  // Responding with a default message
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('PROXY SERVER - OK!');
}
