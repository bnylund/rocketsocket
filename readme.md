# Rocket League socket.io server

Connects to SOS / RCON sockets in BakkesMod plugin.  
_node v14+ required, using optional chaining_

- Clone the repo, then run 'npm install'
- Start server with 'npm start'

Updated 08/06/21

- Added Express routing and static serving from build folder
- Added NGROK tunneling, spawn as child process, etc. Add required params in .env

_if these new features are not required, use previous commit_

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
