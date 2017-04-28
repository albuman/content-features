var fs = require('fs');
var http = require('http');
var mime = require('mime');
var htmlTemplates = require('./HTMLtemplates');

//to add additional sites in file "/data/resolvedSites.json", type in array \"new-web-site\" separated by comma
var resolvedSites = JSON.parse(require('./resolvedSites.json'));

function handlePOST (obj, respond){
	
	var handlers,
		sendedKeys;
	
	handlers = {
		requestedSite: function (data, respond) {
			var autorizedSites = new RegExp(resolvedSites.join('|'));
			if(autorizedSites.test(data)){
				makeRequest(data, respond)
			}
		},
		positionToCopy: function (data, respond) {
			//respond(200, createReadable('Copied'))
		},
		getHistoryFile: function (data, respond) {
			
		},
		path: function(data, respond){
			if(data.drive || data.folder){
				
				respond(200, createReadable(data.drive + ' ' + data.folder))
			} else {
				respond(405, htmlTemplates.noAccess(), 'text/html')
			}
			
		},
		updateHistory: function (data, respond) {
			
		}
	};
	sendedKeys = Object.keys(obj);
	if(sendedKeys.length){
		sendedKeys.forEach(function(key){
			if(handlers[key]){
				handlers[key](obj[key], respond)
			} else {
				respond(405, htmlTemplates.noAccess(), 'text/html')
			}
		});
	} else {
		respond(405, htmlTemplates.noAccess(), 'text/html')
	}
}

module.exports = {
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
						
						htmlTemplate = htmlTemplates.container(links);
						
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
			parsedData;
		
		body = '';
		req.on('data', function (data) {
			body += data.toString();
		});
		req.on('end', function(){
			try{
				parsedData = JSON.parse(body);
			} catch(e){
				parsedData = {};
			}
			handlePOST(parsedData, respond);
			
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




function makeRequest(path, callback) {
	http.get(path, (res)=>{
		http.get(res.headers.location || path, (response)=>{
			callback(200, response, 'text/html')
		});
		
	});
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