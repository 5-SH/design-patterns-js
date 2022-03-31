const amqp = require('amqplib');
const { processTask } = require('./processTask.js');

// node worker.js
async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const { queue } = await channel.assertQueue('tasks_queue');

  channel.consume(queue, async rawMessage => {
    const found = processTask(JSON.parse(rawMessage.content.toString()));
    if (found) {
      console.log(`Found! => ${found}`);
      await channel.sendToQueue('results_queue', Buffer.from(`Found: ${found}`));
    }

    await channel.ack(rawMessage);
  });
}

main().catch(err => console.error(err));
