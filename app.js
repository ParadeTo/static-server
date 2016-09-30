var http = require('http');
var fs = require('fs');
var path = require('path');
var events = require('events');
var url = require('url');
var proxy = new events.EventEmitter();
var mime = require('./mime').types;
var PORT = 8000;
var staticPath = 'public'
// 创建一个服务
var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	var realPath = staticPath + pathname;
	 fs.exists(realPath, function (exists) {
		if (!exists) {
			proxy.emit('not-found',response,pathname);
		} else {
			fs.readFile(realPath, "binary", function(err, file) {
				if (err) {
					proxy.emit('inner-err',response,err);
				} else {
					var contentType = getMimeType(pathname);
					response.writeHead(200, {'Content-Type': contentType});
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
});

// 根据文件名得到返回的mime类型
function getMimeType(filename) {
	var ext = path.extname(filename);
	ext = ext ? ext.slice(1) : 'unknown';
	return mime[ext] || "text/plain";
}

// 事件处理
// 没有找到文件
proxy.on('not-found',function(res, pathname) {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.write("This request URL " + pathname + " was not found on this server.");
	res.end()
});
// 服务器内部错误
proxy.on('inner-err',function(res, err) {
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end(err);
});


// 监听端口
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
