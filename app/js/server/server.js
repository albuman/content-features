var http = require('http');
var fs = require('fs');
var methods = require('./methods');
var htmlTemplates = require('./HTMLtemplates');



const port = 4444;
const host = 'localhost';





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

	if(methods[req.method] && ((req.method).toLowerCase() == "get")){
		if(url == '/'){
			requestedFile = fs.createReadStream('app/views/index.html', 'utf8');
			respond(200, requestedFile, 'text/html');
		} else {
			methods[req.method](urlToPath(url), respond);
		}
		
	} else if(methods[req.method] && (req.method).toLowerCase() == "post"){
        methods[req.method](req, respond)
    } else {
	    respond(405, htmlTemplates.noAccess(), 'text/html')
    }
	

}


function listenHandle(req, res){
    console.log("start listen on " + host + ':' + port);
}

http.createServer(requestHandle).listen(port, host, listenHandle);
