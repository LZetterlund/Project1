"use strict";

const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read the client html file into memory
// __dirname in node is the current directory
// (in this case the same folder as the server js file)
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the http server into socketio and grab the webscoket server as io
const io = socketio(app);

// keep track of player 1 (eventually player 2 as well)
let player1ID = null;

const join = (data) => {
  if (player1ID == null) { player1ID = data.userID; }
};

const update = (data) => {
  const x = data.x;
  const y = data.y;
  const height = data.height;
  const width = data.width;
  const imgData = data.imgData;
  const isPlayer1 = data.userID === player1ID;
    // for debug purposes
  const currentUser = data.userID;
  const player1 = player1ID;

  io.sockets.in('room1').emit('draw', { x, y, height, width, imgData, isPlayer1, currentUser, player1 });
};

// supposed to open up new spot for player 1, but somehow data is always undefined
const disconnect = (data) => {
  console.log(`Current: ${data.userID} Player1: ${player1ID} ${data.debug}`);
  if (data.userID === player1ID) {
    player1ID = null;
    console.log('disconnecting');
  }
};


io.sockets.on('connection', (socket) => {
  console.log('started');

//  onJoined(socket);
  socket.on('join', (data) => {
    socket.join('room1');
    join(data);
  });
  socket.on('update', (data) => {
    update(data);
  });
  socket.on('disconnect', (data) => {
    console.log(`Current: ${data.userID} Player1: ${player1ID} ${data.debug}`);
    disconnect(data);
  });
});

console.log('Websocket server started');

// Two players must work together to draw an object or concept (pictionary)
// The object is split in half, each player can only draw on the top/bottom, or left/right
// Option: Can players only see what they are drawing, and not their partner,
// they would be able to see where their partners drawing would be attached tho?
// Or can players see their partners drawing attached to their as they are drawing it?
// OR can players only see what their partner is drawing and
// it is as if they themselves are drawing in invisible ink?
// Next time: have other players try to guess what is going on? Limit players...
