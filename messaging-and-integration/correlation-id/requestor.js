const { fork } = require('child_process');
const { once } = require('events');
const { createRequestChannel } = require('./createRequestChannel.js');

async function main() {
  const channel = fork('replier.js');
  const request = createRequestChannel(channel);
  
  try {
    const [message] = await once(channel, 'message');
    console.log(`Child process initialized: ${message}`);
    const p1 = request({ a: 1, b: 2, delay: 500 })
      .then(res => console.log(`Reply: 1 + 2 = ${res.sum}`));

    const p2 = request({ a: 6, b: 1, delay: 100 })
      .then(res => console.log(`Reply: 6 + 1 = ${res.sum}`));

    await Promise.all([p1, p2]);
  } finally {
    channel.disconnect();
  }
}

main().catch(err => console.error(err));