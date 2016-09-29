var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('./mime').types;
var PORT = 8000;
var staticPath = 'public'
// 创建一个服务
var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	var realPath = staticPath + pathname;
	 fs.exists(realPath, function (exists) {
		if (!exists) {
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.write("This request URL " + pathname + " was not found on this server.");
			response.end()
		} else {
			fs.readFile(realPath, "binary", function(err, file) {
				if (err) {
					response.writeHead(500, {'Content-Type': 'text/plain'});
					response.end(err);
				} else {
					response.writeHead(200, {'Content-Type': 'text/html'});
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

// 监听端口
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");