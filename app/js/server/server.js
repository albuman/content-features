var http = require('http');
var fs = require('fs');
var mime = require('mime');
var htmlContainer = require('./htmlContainer');



const port = 4444;
const host = 'localhost';
var methods = {
    'GET' : function(path, respond){
        fs.stat(path, function(error, stats){
        	if(error && error.code == "ENOENT"){
        		respond(404, htmlNotFoundTemplate(), 'text/html')
			} else if(error){
        		respond(500, error.toString())
			} else if(stats.isDirectory()){
				fs.readdir(path, function(err, files){
					if(err){
						respond(500, err.toString())
					} else {
						var links,
							htmlTemplate;
						
						links = [].concat('<a href=' + getUpPath(path) + '> ... </a><br>');
						links = links.concat(files.map(function(file){return '<a href=' + path.replace('.', '') + '/' + file + '>' + file + '</a><br>'})).join('');
						
						htmlTemplate = htmlContainer(links);
						
						respond(200, createReadable(htmlTemplate), 'text/html');
					}
					
				});
			} else {
				respond(200, fs.createReadStream(path), mime.lookup(path));
			}
		})
    },
	'POST': function(path, data){
    	
	}
};

function createReadable(dataToRead){
	var toPipe,
		readable;
	
	readable = require('stream').Readable;
	toPipe = new readable();
	
	toPipe.push(dataToRead);
	toPipe.push(null);
	
	return toPipe;
}

function getUpPath (path) {
	path = path.substring(1);
	var pathToUp,
		existMoreSlash,
		replacingIndex;
	
	replacingIndex = path.lastIndexOf('/');
	
	if(replacingIndex == 0){
		return '/';
	}
	
	pathToUp = path.slice(0, replacingIndex);
	existMoreSlash = path[replacingIndex-1] == '/' || path[replacingIndex+1] == '/' ;
	
	if(existMoreSlash){
		return getUpPath(pathToUp);
	}
	return pathToUp;
}

function htmlNoAccesTemplate(){
    return fs.createReadStream('app/views/no-access.html');
}

function htmlNotFoundTemplate(){
	return fs.createReadStream('app/views/404.html');
}

function urlToPath(url){
    var path = require('url').parse(url).pathname;
    return '.' + decodeURIComponent(path);
}
function requestHandle(req, res){
    var url,
        requestedFile;
    
    url = req.url;
	
	function respond(code, body, type) {
		if (!type) {
			type = "text/plain";
		}
		res.writeHead(code, {'Content-Type': type});
		if (body && body.pipe) {
			body.pipe(res);
		}
	}
	if(methods[req.method]){
		if(url == '/'){
			requestedFile = fs.createReadStream('app/views/index.html', 'utf8');
			respond(200, requestedFile, 'text/html');
		} else {
			methods[req.method](urlToPath(url), respond);
		}
		
	} else {
	    respond(405, htmlNoAccesTemplate(), 'text/html')
    }
	

}

var path = 'http://mta.ua/index.php?route=product/product&path=2&product_id=64225';
http.get(path, (res)=>{
	http.get(res.headers.location, (response)=>{
		response.on('data', function(chunk){
			console.log(chunk.toString('utf-8'))
		})
	});
	req.end()
	
});

function listenHandle(req, res){
    console.log("start listen on " + host + ':' + port);
}

http.createServer(requestHandle).listen(port, host, listenHandle);
