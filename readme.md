# Rocket League socket.io server

Connects to SOS / RCON sockets in BakkesMod plugin.  

- Clone the repo, then run 'npm install'
- Start server with 'npm start'

To implement in your app, connect back to the server with a new socket.io client  
e.g:

```js
import socketIOClient from 'socket.io-client';

// instantiate socketIOClient connection to localhost
socket = socketIOClient('localhost:5000');
// emit join message to socket with client ID
socket.emit('join', 'FRONTEND');
/* emit watchGame message to socket, required for backend server to
create and destroy stream on per client ID basis */
socket.emit('watchGame');
// on socket message 'update', run logic on that data
socket.on('update', (update) => {
  // run socket logic here, e.g:
  if (update.event === 'game:update_state') {
    // do stuff with update
    console.log(update.data)
    //etc
  }
}
```