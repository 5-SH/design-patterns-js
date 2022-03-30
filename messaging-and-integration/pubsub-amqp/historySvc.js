const { createServer } = require('http');
const level = require('level');
const timestamp = require('monotonic-timestamp');
const JSONStream = require('JSONStream');
const amqp = require('amqplib');

// node index.js
async function main() {
  const db = level('./msgHistory');
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange('chat', 'fanout');
  const { queue } = channel.assertQueue('chat_history');
  await channel.bindQueue(queue, 'chat');

  channel.consume(queue, async msg => {
    const content = msg.content.toString();
    console.log(`Saving message: ${content}`);
    await db.put(timestamp(), content);
    channel.ack(msg);
  });

  createServer((req, res) => {
    res.writeHead(200);
    db.createValueStream()
      .pipe(JSONStream.stringify())
      .pipe(res);
  }).listen(8090);
}

main().catch(err => console.error(err));