const chatEl = document.getElementById('chat');
const formEl = document.getElementById('messageForm');
const nameInputEL = document.getElementById('name');
const messageInputEL = document.getElementById('message');

const ws = new WebSocket('ws://localhost:8000');
ws.onmessage = (res) => {
  const messages = JSON.parse(res.data);
  messages.forEach(val => {
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${val.name}: ${val.message}`));
    chatEl.appendChild(messageEl);
  });
}

const send = (event) => {
  event.preventDefault();

  console.log('send', {
    name: nameInputEL.value,
    message: messageInputEL.value,
  });
  
  ws.send(JSON.stringify({
    name: nameInputEL.value,
    message: messageInputEL.value,
  }));
}

formEl.addEventListener('submit', send);