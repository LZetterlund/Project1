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

// keep track of players
let rooms = [];

const join = (data) => {
    var roomEntered = rooms.filter(function(obj) {
        return obj.ID == data.roomID;
    });
  if (roomEntered[0].player1ID == null) { console.log("Player 1 added"); roomEntered[0].player1ID = data.userID; }
  else if (roomEntered[0].player2ID == null) { console.log("Player 2 added"); roomEntered[0].player2ID = data.userID; }
};

const update = (data) => {
  var roomEntered = rooms.filter(function(obj) {
        return obj.ID == data.roomID;
    });
if(roomEntered[0] != null){
  const x = data.x;
  const y = data.y;
  const height = data.height;
  const width = data.width;
  const imgData = data.imgData;
  const isPlayer1 = data.userID === roomEntered[0].player1ID;
  const isPlayer2 = data.userID === roomEntered[0].player2ID;
    // for debug purposes
  const currentUser = data.userID;
  const player1 = roomEntered[0].player1ID;
  const player2 = roomEntered[0].player2ID;

  io.sockets.in(data.roomID).emit('draw', { x, y, height, width, imgData, isPlayer1, isPlayer2, currentUser, player1, player2 });
}
};

// supposed to open up new spot for player 1, but somehow data is always undefined
const disconnec = (data) => {
    var roomEntered = rooms.filter(function(obj) {
        return obj.ID == data.roomID;
    });
  if(roomEntered[0] != null){
   console.log(`CurrentUser: ${data.userID} Player1: ${roomEntered[0].player1ID} Player2: ${roomEntered[0].player2ID}`);
   if (data.userID == roomEntered[0].player1ID) {
        roomEntered[0].player1ID = null;
     console.log('disconnecting player 1 from room: ' + roomEntered[0].ID);
   }
    
    if (data.userID == roomEntered[0].player2ID) {
        roomEntered[0].player2ID = null;
     console.log('disconnecting player 2 from room: ' + roomEntered[0].ID);
   }
 }
};


io.sockets.on('connection', (socket) => {
  console.log('started');

//  onJoined(socket);
    //io.sockets.manager.room to check active rooms
  socket.on('join', (data) => {
    var room = data.roomID;
      socket.room = room;
      socket.user = data.userID;
      //check if syntax is correct
    var result = rooms.filter(function(obj) {
        return obj.ID == room;
    });
    if(result[0] != undefined){
        socket.join(result[0].ID);
        console.log('Joined room ' + result[0].ID);
    }
    else{
        rooms[rooms.length] = {ID: room, Player1: null, Player2: null};
        socket.join(room);
        console.log('Joined room ' + room);
    }
    join(data);
  });
  socket.on('update', (data) => {
    update(data);
  });
  socket.on('disconnec', (data) => {
    disconnec(data);
  });
  socket.on('disconnect', () => {
     const data = {roomID: socket.room, userID: socket.user}
     disconnec(data);
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
