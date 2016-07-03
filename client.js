var net = require('net');

var output = process.stdout;
output.setEncoding('utf8');

var args = process.argv;

var reqParts = args[2].split('/');
var URL = reqParts[0];
var path;
if (path === undefined) {
  path = '/';
  } else {
  path = '/' + reqParts[1];
}
var PORT;
if (URL === 'localhost' || URL === '127.0.0.1') {
  PORT = 8080;
} else {
  PORT = 80;
}
var method = 'GET';
var headers = false;

if(args[3]) {
  for (var i = 3; i < args.length; i++) {
    if (args[i] === '--method') {
      method = args[i + 1].toUpperCase();
    }
    if (args[i] === '--header') {
      headers = true;
    }
    if (args[i] === '--port') {
      PORT = args[i + 1];
    }
  }
}
console.log(PORT);

if (URL === undefined) {
  console.log('Usage: node client.js [url] --method [GET/POST/PUT/DELETE/HEAD] --header --port [port number]');
  } else {
    var client = net.createConnection(PORT, URL, function () {

      var today = new Date();
      var requestHeaders = method + ' ' + path + ' HTTP/1.1\n';
      requestHeaders += 'Date: ' + today.toUTCString() + '\n';
      requestHeaders += 'Host: ' + URL + '\n';
      requestHeaders += 'User-Agent: http-client/0.1\n';
      console.log(requestHeaders);
      client.write(requestHeaders + '\n');
  });

  client.on('data', function (data) {
    console.log(data.toString());
    client.end();
  });

  client.on('end', function (){
    console.log('Disconnected from server.');
  });

  client.on('error', function (err) {
    throw err;
  });
}
