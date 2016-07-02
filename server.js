var net = require('net');
var fs = require('fs');


var PORT = 8080;
var HOST = '127.0.0.1';

var server = net.createServer(function (client) {
  console.log('client connected');

  client.on('data', function (data) {
    var today = new Date();
    var request = data.toString().split('\n');
    var path = request[0].split(' ')[1];
    var statusCode = '200 OK';
    if (path === '/') {
      path = 'index.html';
    } else if (path === '/helium.html' || path === '/hydrogen.html') {
      path = path.slice(1);
    } else {
      path = '404.html';
      statusCode = '404 Not Found';
    }


    var responseHeaders = 'HTTP/1.1 ' + statusCode + '\n';
    responseHeaders += 'Date: ' + today.toUTCString() + '\n';
    responseHeaders += 'Server: nginy/1.0.0 \n';

    var response = fs.readFile(path, 'utf-8', function (err, data) {
      if (err) {
        throw err;
      } else {
        responseHeaders += 'Content-Length: ' + data.length + '\n';
        client.write(responseHeaders + '\n' + data);
        }
      });
  });


});

server.listen(PORT, HOST, function () {
  console.log('Listening on port ' + PORT);
});