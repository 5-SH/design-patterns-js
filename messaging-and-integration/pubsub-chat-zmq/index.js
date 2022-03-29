const { createServer } = require('http');
const staticHandler = require('serve-handler');
const ws = require('ws');
const yargs = require('yargs');
const zmq = require('zeromq');

// node index.js --http 8080 --pub 5000 --sub 5001 --sub 5002
// node index.js --http 8081 --pub 5001 --sub 5000 --sub 5002
// node index.js --http 8082 --pub 5002 --sub 5000 --sub 5001
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' });
});

let pubSocket;
async function initializeSockets() {
  pubSocket = new zmq.Publisher();
  await pubSocket.bind(`tcp://127.0.0.1:${yargs.argv.pub}`);

  const subSocket = new zmq.Subscriber();
  const subPorts = [].concat(yargs.argv.sub);
  for (const port of subPorts) {
    console.log(`Subscribing to ${port}`);
    subSocket.connect(`tcp://127.0.0.1:${port}`);
  }
  subSocket.subscribe('chat');

  for await (const [msg] of subSocket) {
    console.log(`Message from another server: ${msg}`);
    broadcast(msg.toString().split(' ')[1]);
  }
}

initializeSockets();

const wss = new ws.Server({ server });
wss.on('connection', client => {
  console.log('Client connected');
  client.on('message', msg => {
    console.log(`Message: ${msg}`);
    broadcast(msg);
    pubSocket.send(`chat ${msg}`);
  });
});

function broadcast(msg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(msg));
    }
  }
}

server.listen(yargs.argv.http || 8080);