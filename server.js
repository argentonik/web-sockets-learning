const WebSocket = require('ws');

const server = new WebSocket.Server({port: 3000});

server.on('connection', ws => {
  ws.on('message', message => {
    server.clients.forEach(client => {
      if (message.toString() === 'exit') {
        ws.close();
      } else {
        if (client.readyState === WebSocket.OPEN) {
          console.log('message', message.toString());
          client.send(message.toString());
        }
      }
    })
  });

  ws.send('Добро пожаловать');
});