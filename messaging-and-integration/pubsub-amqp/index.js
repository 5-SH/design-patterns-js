const { createServer } = require('http');
const staticHandler = require('serve-handler');
const ws = require('ws');
const amqp = require('amqplib');
const JSONStream = require('JSONStream');
const superagent = require('superagent');

// node index.js 8080
// node index.js 8081
const httpPort = process.argv[2] || 8080;

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange('chat', 'fanout');
  const { queue } = await channel.assertQueue(
    `chat_srv_${httpPort}`,
    { exclusive: true }
  );
  await channel.bindQueue(queue, 'chat');
  channel.consume(queue, msg => {
    msg = msg.content.toString();
    console.log(`From queue: ${msg}`);
    broadcast(msg);
  }, { noAck: true });

  const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'www' });
  });

  const wss = new ws.Server({ server });
  wss.on('connection', client => {
    console.log('Client connected');

    client.on('message', msg => {
      console.log(`Message: ${msg}`);
      channel.publish('chat', '', Buffer.from(msg));
    });

    superagent
      .get('http://localhost:8090')
      .on('error', err => console.error(err))
      .pipe(JSONStream.parse('*'))
      .on('data', msg => client.send(msg));
  });

  function broadcast(msg) {
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
        client.send(msg);
      }
    }
  }

  server.listen(httpPort);
}

main().catch(err => console.error(err));