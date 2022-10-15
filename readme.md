# Rocket League socket.io server

Connects to SOS / RCON sockets in BakkesMod plugin.

_node v14+ required, using optional chaining_

- Clone the repo, then run 'npm install'

- Edit the .env file, CORS origins are specified as comma delimited strings, enter your RLHOST and RCONHOST addresses
  e.g:  
  CORS = 'http://localhost:3000, 'http://server.ip.here:3000'
  RLHOST = 'http://localhost:49122, http://server.ip.here:49122'
  RCONHOST = 'http://localhost:9002, http://server.ip.here:9002'

- Value required for RCONPASS will attempt to be auto-populated from default installation dir. Otherwise, can be found by opening BakkesMod, going to File -> Open BakkesMod Folder -> open cfg folder, -> open config.cfg -> find "rcon_password" entry.

- Start server with 'npm start'

To implement in a standard HTML page, source the socket.io client from CDN,  
check at https://cdnjs.com/libraries/socket.io for current links, then import via script tag:

```html
<head>
  <!-- other script tags, etc -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.min.js"></script>
  <!-- other script tags, etc -->
</head>

<body>
  <script>
    const socket = io('http://localhost:6969', {
      withCredentials: true,
    });
    socket.on('connect', () => {
      // emit join message to socket with client ID
      socket.emit('join', 'FRONTEND');
      /* emit watchGame message to socket, required for backend server to
      create and destroy stream on per client ID basis */
      socket.emit('watchGame');
    });
    // on socket message 'update', run logic on that data
    socket.on('update', (update) => {
      // run socket logic here, e.g:
      if (update.event === 'game:update_state') {
        //do stuff with update
        console.log(update.data);
        //etc
      }
    });
  </script>
</body>
```

To implement in your app using a framework, e.g. React/Vue/Angular/Svelte etc,  
connect back to the server with a new socket.io client  
e.g:

```js
import socketIOClient from 'socket.io-client';

// instantiate socketIOClient connection to localhost
const socket = socketIOClient('http://localhost:6969', {
  withCredentials: true,
});
socket.on('connect', () => {
  // emit join message to socket with client ID
  socket.emit('join', 'FRONTEND');
  /* emit watchGame message to socket, required for backend server to
  create and destroy stream on per client ID basis */
  socket.emit('watchGame');
})
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

## Update - ButtonMash plugin included for auto-spectate/auto-hide HUD elements

RCON usage is no longer necessary for hiding HUD elements as originally described below, using the included ButtonMash plugin, there are options under F2 -> Plugins -> ButtonMash to enable the auto-spectate and auto-hide HUD features.
Spectator camera commands can now also be sent via RCON with this plugin, to change player view.

Usage: copy ButtonMash.dll to your BakkesMod plugins folder, if not automatically enabled, enable the plugin from F2 -> Plugins menu.

Note: there is a bug where you will only see a quit game menu with auto-spectate enabled (non-admin) if launching a match using mouse/keyboard - use a controller to launch a match to avoid this issue. Otherwise disable this feature.

For RCON usage, any commands you wish to use through the RCON connection, must be added to the allowed commands file under:  
`C:\Users\USERNAME\AppData\Roaming\bakkesmod\bakkesmod\data\rcon_commands.cfg`

I'd recommend adding the following commands to the file:
`rcon_refresh_allowed`
`replay_gui`
`ButtonMash`

## RCON usage

Declare an rconSend function in your frontend app, e.g.:

```js
function rconSend(command) {
  socket.emit('RCON', {
    data: {
      command: command,
    },
  });
}
```

example for a ButtonMash command:

```js
rconSend('ButtonMash 0');
```

Old RCON usage example for hiding HUD elements if you don't wish to use plugin:

```js
if (update.event === 'game:post_countdown_begin') {
  rconSend('rcon_refresh_allowed');
  rconSend('replay_gui hud 1');
  rconSend('replay_gui matchinfo 1');
  setTimeout(() => {
    rconSend('replay_gui hud 0');
    rconSend('replay_gui matchinfo 0');
  }, 100);
}
```
