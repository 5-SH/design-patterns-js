const zmq = require('zeromq');
const { processTask } = require('./processTask.js');

// node worker.js
async function main() {
  const fromVentilator = new zmq.Pull();
  const toSink = new zmq.Push();

  fromVentilator.connect('tcp://localhost:5016');
  toSink.connect('tcp://localhost:5017');

  for await (const rawMessage of fromVentilator) {
    const found = processTask(JSON.parse(rawMessage.toString()));
    if (found) {
      console.log(`Found! => ${found}`);
      await toSink.send(`Found: ${found}`);
    }
  }
}

main().catch(er => console.error(err));
