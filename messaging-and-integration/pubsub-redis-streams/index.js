const { createServer } = require('http');
const staticHandler = require('serve-handler');
const ws = require('ws');
const Redis = require('ioredis');

const redisClient = new Redis();
const redisClientXRead = new Redis();

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' });
});

const wss = new ws.Server({ server });
wss.on('connection', async client => {
  console.log('Client connected');

  client.on('message', msg => {
    console.log(`Message: ${msg}`);
    redisClient.xadd('chat_stream', '*', 'message', msg);
  });

  const logs = await redisClient.xrange(
    'chat_stream', '-', '+'
  );
  for (const [,[, message]] of logs) {
    client.send(message);
  }
});

function broadcast(msg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
}

let lastRecordId = '$';

async function processStreamMessages() {
  while (true) {
    const [[, records]] = await redisClientXRead.xread(
      'BLOCK', 0, 'STREAMS', 'chat_stream', lastRecordId
    );
    for (const [recordId, [, message]] of records) {
      console.log(`Message from stream: ${message}`);
      broadcast(message);
      lastRecordId = recordId;
    }
  }
}

processStreamMessages().catch(err => console.error(err));

server.listen(process.argv[2] || 8080);