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
                Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
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

	} else if(methods[req.method] && (req.method).toLowerCase() == "options"){

		methods[req.method](res)

	} else {

	       respond(405, htmlTemplates.noAccess(), 'text/html')

	}
	

}

function updatePositionFile(){
	var defaultPthFile;
	try {
		defaultPthFile = require('../../../data/defaultPaths.json');
		
	} catch(e){
		console.log(e)
	}
	if(defaultPthFile){
		fs.readdir(defaultPthFile.drive, function(err, files){
			if(err){
				console.log(err)
			} else {
				fs.writeFile('./data/allPosition.json', JSON.stringify(files, null, '\t'), function(err){
					if(err){
						console.log(err)
					} else {
						console.log('allPosition.json updated!');
						setTimeout(updatePositionFile, 14400000); // 14400000ms === 4hours
					}
				})
			}
			
		})
	}
}
function listenHandle(req, res){
    console.log("start listen on " + host + ':' + port);
	updatePositionFile()
	
	
}

http.createServer(requestHandle).listen(port, host, listenHandle);
