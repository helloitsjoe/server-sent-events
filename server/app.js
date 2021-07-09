const http = require('http');
const path = require('path');
const express = require('express');
const EventEmitter = require('events');

const createApp = (port = 3000) => {
  const broadcast = new EventEmitter();

  const app = express();
  const server = http.createServer(app);

  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.use(express.json());

  app.post('/message', (req, res) => {
    console.log(req.body);
    res.status(200).send({ status: 'OK' });
    broadcast.emit('message', req.body.message);
  });

  app.get('/subscribe', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
    });

    res.write('data: Connected\n\n');
    broadcast.on('message', data => {
      console.log('Broadcasting', data);
      res.write(`data: ${JSON.stringify({ messages: [data] })}\n\n`);
    });
  });

  server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

module.exports = createApp;
