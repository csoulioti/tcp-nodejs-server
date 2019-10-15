const net = require('net');
const port = 7070;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');
});


let sockets = [];

server.on('connection', function(socket) {
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    sockets.push(socket);

    socket.on('data', function(data) {
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(socket, index, array) {
          socket.write(socket.remoteAddress + ':' + socket.remotePort + " said " + data + '\n');
        });
    });

     // Add a 'close' event handler to this instance of socket
     socket.on('close', function(data) {
      let index = sockets.findIndex(function(o) {
          return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort;
      })
      if (index !== -1) sockets.splice(index, 1);
      console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
  });
});