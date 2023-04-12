const { performance } = require('perf_hooks');
const axios = require('axios');
const https = require('https');

// Configurations for each microservice
const config = {
  oauth: { url: '/', method: 'GET' },
  graph: { url: '/', method: 'GET' },
  api: { url: '/', method: 'GET' },
  eventEmitter: { url: '/', method: 'GET' },
  spa: { url: '/', method: 'GET' }
};

// Test each microservice through the proxy server
async function runTests() {
  for (const serviceName in config) {
    console.log(`Running benchmark for ${serviceName}...`);
    const serviceConfig = config[serviceName];
    switch (serviceName) {
      case 'oauth':
      case 'graph':
      case 'api':
      case 'spa':
      case 'eventEmitter':
        await runHttpTest(serviceName, serviceConfig);
        break;
      default:
        console.log(`Unknown service: ${serviceName}`);
        break;
    }
  }
}

// Test an HTTP-based microservice through the proxy server
async function runHttpTest(serviceName, serviceConfig) {
  const t0 = performance.now();
  const numRequests = 100;
  for (let i = 0; i < numRequests; i++) {
    await axios({
      method: serviceConfig.method,
      url: `https://localhost:8443${serviceConfig.url}`,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
  }
  const t1 = performance.now();
  const duration = t1 - t0;
  const rps = numRequests / (duration / 1000);
  console.log(`Benchmark for ${serviceName}: ${numRequests} requests in ${duration} ms (${rps.toFixed(2)} requests per second)`);
}

// Test an event-based microservice
async function runEventEmitterTest(serviceName, serviceConfig) {
  const t0 = performance.now();
  const numEvents = 100;
  for (let i = 0; i < numEvents; i++) {
    // Emit the event
    emitter.emit('event', serviceConfig.data);
  }
  const t1 = performance.now();
  const duration = t1 - t0;
  const eps = numEvents / (duration / 1000);
  console.log(`Benchmark for ${serviceName}: ${numEvents} events in ${duration} ms (${eps.toFixed(2)} events per second)`);
}

// Start the tests
runTests();
