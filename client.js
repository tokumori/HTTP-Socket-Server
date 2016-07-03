var net = require('net');

var output = process.stdout;
output.setEncoding('utf8');

var args = process.argv;

var reqParts = args[2].split('/');
var URL = reqParts[0];
var path;
if (reqParts[1]) {
  path = '/' + reqParts[1];
  } else {
  path = '/';
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
    if (args[i] === '--headers') {
      headers = true;
    }
    if (args[i] === '--port') {
      PORT = args[i + 1];
    }
  }
}

if (URL === undefined) {
  console.log('使用する方法: node client.js [url] --method [GET/POST/PUT/DELETE/HEAD] --header --port [port number]');
  } else {
    var client = net.createConnection(PORT, URL, function () {

      var today = new Date();
      var requestHeaders = method + ' ' + path + ' HTTP/1.1\n';
      requestHeaders += 'Date: ' + today.toUTCString() + '\n';
      requestHeaders += 'Host: ' + URL + '\n';
      requestHeaders += 'User-Agent: http-client/0.1\n';
      client.write(requestHeaders + '\n');
  });

  client.on('data', function (data) {
    var splitData = data.toString().split('\r');
    var headerData;
    for (var i = 0; i < splitData.length; i++) {
      if (splitData[i] === '\n') {
        headerData = splitData.splice(0, i);
        break;
      }
    }
    var statusCode = headerData[0].split(' ')[1].slice(0, 2);
    if (statusCode === '40') {
      console.log('おまえはバカか？');
    } else if (statusCode === '50') {
      console.log('このサーバはダメだから別のページに行ってください');
    }

    if (headers) {
      console.log(headerData.join());
    } else {
      console.log(data.toString());
    }
    client.end();
  });

  client.on('end', function (){
    console.log('接続解除しました');
  });

  client.on('error', function (err) {
    var errorCode = err.code;
    if (errorCode === 'ENOTFOUND') {
      console.log('指定されたURLは存在しませんでした');
    } else if (errorCode === 'ECONNREFUSED') {
      console.log('指定されたポート番はお持ち受けしておりませんでした');
    }
  });
}
