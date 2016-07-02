var net = require('net');

var input = process.stdin;
input.setEncoding('utf8');

var PORT = 8080;
var HOST = '127.0.0.1';

var server = net.createServer(function (client) {
  console.log('client connected');

  client.on('data', function (data) {
    var today = new Date();
    var statusCode = '200 OK';
    var response = 'HTTP/1.1' + statusCode + '\n';
    response += 'Date: ' + today.toUTCString() + '\n';
    response += 'Server: nginy/1.0.0';
    client.write(response);
  });


});

server.listen(PORT, HOST, function () {
  console.log('Listening on port ' + PORT);
});