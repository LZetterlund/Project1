"use strict";

const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3010;

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

// keep track of all different rooms
const rooms = [];

// triggers when user joins a room
const join = (data) => {
// grab the room using the player entered room ID
  const roomEntered = rooms.filter(obj => obj.ID === data.roomID);
 // check to see whether the user can be either first or second player
  if (roomEntered[0].player1ID == null) {
    console.log('Player 1 added');
    roomEntered[0].player1ID = data.userID;
    const playerData = { isPlayer1: data.userID === roomEntered[0].player1ID };
    io.sockets.in(data.roomID).emit('UI', playerData);
  } else if (roomEntered[0].player2ID == null) {
    console.log('Player 2 added');
    roomEntered[0].player2ID = data.userID;
    const playerData = { isPlayer2: data.userID === roomEntered[0].player2ID };
    io.sockets.in(data.roomID).emit('UI', playerData);
  }
  // NEW check if first user, add one user either way
  if (roomEntered[0].users !== undefined) {
    roomEntered[0].users++;
  } else { roomEntered[0].users = 1; }
};

// this is used to send drawing data to other users
const update = (data) => {
// grab the room using the player entered room ID
  const roomEntered = rooms.filter(obj => obj.ID === data.roomID);
  if (roomEntered[0] != null) {
    const x = data.x;
    const y = data.y;
    const height = data.height;
    const width = data.width;
    const imgData = data.imgData;
  // for which canvas the data should go to
    const isPlayer1 = data.userID === roomEntered[0].player1ID;
    const isPlayer2 = data.userID === roomEntered[0].player2ID;
    // for debug purposes
    const currentUser = data.userID;
    const player1 = roomEntered[0].player1ID;
    const player2 = roomEntered[0].player2ID;

    io.sockets.in(data.roomID).emit('draw', { x, y, height, width, imgData, isPlayer1, isPlayer2, currentUser, player1, player2 });
  }
};

// used to pass data through and properly disconnect the drawers from the game
const discPlayers = (data) => {
// grab the room using the player entered room ID
  const roomEntered = rooms.filter(obj => obj.ID === data.roomID);
 // check if room exists as to not error out
  if (roomEntered[0] != null) {
    console.log(`CurrentUser: ${data.userID} Player1: ${roomEntered[0].player1ID} Player2: ${roomEntered[0].player2ID}`);
    if (data.userID === roomEntered[0].player1ID) {
      roomEntered[0].player1ID = null;
      console.log(`disconnecting player 1 from room: ${roomEntered[0].ID}`);
    }

    if (data.userID === roomEntered[0].player2ID) {
      roomEntered[0].player2ID = null;
      console.log(`disconnecting player 2 from room: ${roomEntered[0].ID}`);
    }
  }
};


io.sockets.on('connection', (socket) => {
  console.log('started');

//  onJoined(socket);
    // io.sockets.manager.room to check active rooms
  socket.on('join', (data) => {
    const room = data.roomID;
    socket.room = room;        // eslint-disable-line no-param-reassign
    socket.user = data.userID; // eslint-disable-line no-param-reassign
      // grab the room using the player entered room ID
    const result = rooms.filter(obj => obj.ID === room);
   // checks if room exists as to not error out
    if (result[0] !== undefined) {
      socket.join(result[0].ID);
      console.log(`Joined room ${result[0].ID}`);
    } else { // else just create the room and sets its ID to grab it from the array with no issues
      rooms[rooms.length] = { ID: room };
      socket.join(room);
      console.log(`Joined room ${room}`);
    }
    join(data);
  });
  socket.on('update', (data) => {
    update(data);
  });
  // my disconnect function that removes players from the proper rooms
  socket.on('discPlayers', (data) => {
    discPlayers(data);
  });
  socket.on('disconnect', () => {
  // grab the room using the player entered room ID
    const roomEntered = rooms.filter(obj => obj.ID === socket.room);
   // check if in a room here because this disconnect is only called once, the other possibly more
   // decriment users
    if (roomEntered[0] != null) {
      roomEntered[0].users--;
      const data = { roomID: socket.room, userID: socket.user };
      discPlayers(data);
    }
  });
});

console.log('Websocket server started');
