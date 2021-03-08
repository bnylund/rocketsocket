const app = require('express')();
const http = require('http').Server(app);
const WebSocket = require('ws');

let gameStreams = {};
let rlHost = 'http://localhost:49122';
let RCONHost = 'http://localhost:9002';
const port = 5000;

const server = http.listen(port, () =>
  console.log(`socket.io listening for Client on http://localhost:${port}/`)
);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.watching;
  socket.on('join', (id) => {
    socketId = id;
    if (!!socket._id) {
      socket.leave('game');
      endGameStream(socket._id);
      console.log(`Client ${id} left`);
    }
    socket.join('game');
    socket._id = id;
    console.log(`Client ${id} connected, ID: ${socket.id}`);
  });

  socket.on('watchGame', () => {
    if (!socket.watching) {
      createGameStream(socket._id);
      socket.watching = true;
      console.log(
        `Client ${socket._id} in rooms: ${JSON.stringify(socket.rooms)}`
      );
    }
  });

  // Emit payload data to clients
  socket.on('payload', (payload) => {
    // socket.to('REACTLOCAL').emit('payload', payload);
    socket.to('game').emit('payload', payload);
  });

  // Emit payload data to clients
  socket.on('RCON', (payload) => {
    console.log(`${payload.data.command}`);
    RCONClient.send(`${payload.data.command}`);
  });

  socket.on('disconnect', () => {
    if (socket._id && socket.watching) {
      endGameStream(socket._id);
    }
  });

  socket.on('error', function (err) {
    console.error(err.message);
  });
});

let wsClient;
const initWsClient = () => {
  wsClient = new WebSocket(rlHost);
  wsClient.onclose = function () {
    setTimeout(() => {
      console.error('Rocket League WebSocket Server Closed!');
      console.log('Attempting reconnection...');
      initWsClient();
    }, 10000);
  };

  wsClient.onopen = function open() {
    console.log(`Connected to Rocket League on ${rlHost}`);
  };

  wsClient.onmessage = function (message) {
    let data = JSON.parse(message.data);
    io.in('game').emit('update', data);
    // Log WS messages here
    // console.info(data.event);
  };

  wsClient.onerror = function (err) {
    console.error(
      'Error connecting to SOS, is the plugin running? Try plugin load SOS from BakkesMod console to be sure'
    );
    wsClient.close();
  };

  wsClient.on('error', function (err) {
    console.log(err.message);
    wsClient.close();
  });
};
initWsClient();

let RCONClient;
const initRCONClient = () => {
  RCONClient = new WebSocket(RCONHost);
  RCONClient.onclose = function () {
    setTimeout(() => {
      console.error('Rocket League RCON connection Closed!');
      console.log('Attempting reconnection...');
      initRCONClient();
    }, 10000);
  };

  RCONClient.onopen = function open() {
    console.log(`Connected to RCON on ${RCONHost}`);
    RCONClient.send('rcon_password ' + 'password');
    RCONClient.send('rcon_refresh_allowed');
  };

  RCONClient.onmessage = function (message) {
    console.log(message.data);
  };

  RCONClient.onerror = function (err) {
    console.error('Error connecting to RCON!');
    RCONClient.close();
  };

  RCONClient.on('error', function (err) {
    console.log(err.message);
    RCONClient.close;
  });
};
initRCONClient();

createGameStream = (id) => {
  if (gameStreams[id]) {
    gameStreams[id].connected++;
    return gameStreams[id];
  }
  gameStreams[id] = {
    ws: wsClient,
    connected: 1,
  };
};

endGameStream = (id) => {
  if (gameStreams[id]) {
    gameStreams[id].connected--;
    if (gameStreams[id].connected < 1) {
      console.log(`Client ${id} disconnected`);
      gameStreams[id].ws.close();
      delete gameStreams[id];
    }
  }
};
