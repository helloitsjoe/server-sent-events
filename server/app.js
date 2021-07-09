const http = require('http');
const path = require('path');
const express = require('express');
const EventEmitter = require('events');

const createApp = (port = 3000, broadcast = new EventEmitter()) => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.use(express.json());

  app.post('/message', (req, res) => {
    console.log(req.body);
    res.status(200).send({ status: 'OK' });
    console.log('Broadcasting', req.body.message);
    broadcast.emit('message', req.body.message);
  });

  app.get('/subscribe', (req, res) => {
    console.log('New connection');

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.write('data: Connected\n\n');

    const handler = data => {
      // Client expects an array of messages. For now I send a single
      // message at a time but at some point I can make this more robust
      // to handle dropped connections, keeping track of unsent messages.
      res.write(`data: ${JSON.stringify({ messages: [data] })}\n\n`);
    };

    // TODO: Keep track of different users
    // TODO: Abstract broadcast into an interface
    broadcast.on('message', handler);

    req.on('close', () => {
      console.log('Closing...');
      broadcast.off('message', handler);
    });

    // TODO: Understand the difference between close and end.
    // Got this from here, but it might not be necessary:
    // https://gist.github.com/akirattii/257d7efc8430c7e3fd0b4ec60fc7a768
    req.on('end', () => {
      console.log('Ending...');
      broadcast.off('message', handler);
    });
  });

  server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

module.exports = createApp;
