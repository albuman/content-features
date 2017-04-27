var http = require('http');
var fs = require('fs');
var mime = require('mime');
var htmlContainer = require('./htmlContainer');

//to add additional sites in file "/data/resolvedSites.json", type in array \"new-web-site\" separated by comma
var resolvedSites = JSON.parse(require('./resolvedSites.json'));

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
	'POST': function(req, respond){
        var body,
			autorizedSites = new RegExp(resolvedSites.join('|'));
		body = '';
        req.on('data', function (data) {
            body += data.toString();
        });
        req.on('end', function(){
        	var parsedData = JSON.parse(body);

            if(parsedData.requestedSite && autorizedSites.test(parsedData.requestedSite)){
                makeRequest(parsedData.requestedSite, respond)
            } else if(parsedData.positionToCopy){
            	respond(200, createReadable('Copied'))
			}
        	
        })
    	

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
		res.writeHead(code, {'Content-Type': type, 'Access-Control-Allow-Origin': req.headers.origin});
		if (body && body.pipe) {
			body.on('data', function(chunk){
				res.write(chunk)
			});
			body.on('end', function () {
                res.end();
            })
		}

	}

	if(methods[req.method] && req.method == "GET"){
		if(url == '/' && req.method == "GET"){
			requestedFile = fs.createReadStream('app/views/index.html', 'utf8');
			respond(200, requestedFile, 'text/html');
		} else {
			methods[req.method](urlToPath(url), respond);
		}
		
	} else if(methods[req.method] && req.method == "POST"){
        methods[req.method](req, respond)
    } else {
	    respond(405, htmlNoAccesTemplate(), 'text/html')
    }
	

}

function makeRequest(path, callback) {
    http.get(path, (res)=>{
        http.get(res.headers.location || path, (response)=>{
            callback(200, response, 'text/html')
        });

    });
}

function listenHandle(req, res){
    console.log("start listen on " + host + ':' + port);
}

http.createServer(requestHandle).listen(port, host, listenHandle);
