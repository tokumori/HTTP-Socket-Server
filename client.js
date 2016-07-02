var net = require('net');

var output = process.stdout;
output.setEncoding('utf8');

var args = process.argv;

var URL = args[2];
var PORT;
if (URL === 'localhost') {
  PORT = 8080;
} else {
  PORT = 80;
}

if (URL === undefined) {
  console.log('Usage: node client.js [url] [GET/POST/PUT/DELETE/HEAD] [port]');
  } else {
    var client = net.createConnection(PORT, URL, function () {

      var today = new Date();
      var requestHeaders = 'GET / HTTP/1.1\n';
      requestHeaders += 'Date: ' + today.toUTCString() + '\n';
      requestHeaders += 'Host: ' + URL + '\n';
      requestHeaders += 'User-Agent: http-client/0.1\n';
      client.write(requestHeaders);
      client.write('\n');
  });

  client.on('data', function (data) {
    console.log(data.toString());
    client.end();
  });

  client.on('end', function (){
    console.log('Disconnected from server.');
  });
}
