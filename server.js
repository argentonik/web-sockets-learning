import WebSocket, {WebSocketServer} from 'ws';
import {v4 as uuid} from 'uuid';
import {writeFile, readFileSync, existsSync} from 'fs';

const clients = {};
const log = existsSync('log') && readFileSync('log');
const messages = JSON.parse(log) || [];


const wsServer = new WebSocketServer({port: 8000});
wsServer.on('connection', (ws) => {
  const id = uuid();
  clients[id] = ws;

  console.log(`New client ${id}`);
  ws.send(JSON.stringify(messages));

  ws.on('message', (rawMessage) => {
    const {name, message} = JSON.parse(rawMessage);
    messages.push({name, message});
    for (const id in clients) {
      clients[id].send(JSON.stringify([{name, message}]));
    }
    console.log(`Got message name: ${name}, message: ${message} from ${id}`);
  });

  ws.on('close', () => {
    delete clients[id];
    console.log(`Client is closed ${id}`);
  });
});

process.on('SIGINT', () => {
  wsServer.close();
  writeFile('log', JSON.stringify(messages), err => {
    if (err) {
      console.log('err');
    }
    process.exit();
  });
});
