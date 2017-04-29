var fs = require('fs');
var http = require('http');
var mime = require('mime');
var htmlTemplates = require('./HTMLtemplates');
var _ = require('lodash');

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
		path: function(data, respond){
			if(data.drive || data.folder){

				fs.writeFile('data/defaultPaths.json', JSON.stringify(data, null, '\t'), function (err) {
					if(err){
                        respond(500, htmlTemplates.noAccess(), 'text/html');
					}
					else {
						respond(200, createReadable('defaultPaths.json updated with: ' + JSON.stringify(data)))
					}
                })

			} else {
				respond(405, htmlTemplates.noAccess(), 'text/html')
			}
			
		},
		updateHistory: function (data, respond) {
			var historyFilePath = 'data/historyLog.json';
			fs.stat(historyFilePath, function(err, stats){
                if(err && (err.code == "ENOENT")){
                    fs.writeFile(historyFilePath, JSON.stringify(data, null, '\t'), function(error){
                        if(error){
                            respond(405, htmlTemplates.noAccess(), 'text/html');
                        } else {
                            respond(200, createReadable('Created'));
                        }
                    });

                } else if (err) {
                    respond(405, htmlTemplates.noAccess(), 'text/html');
                } else if(stats.isFile()){

                    var historyFile = require('../../../'+historyFilePath);
                    var updatedData = _.assignIn({}, historyFile, data);
                    fs.writeFile(historyFilePath, JSON.stringify(updatedData, null, '\t'), function(error){
                    	if(error){
                            respond(405, htmlTemplates.noAccess(), 'text/html');
						} else {
                            respond(200, createReadable('Updated'));
						}
					})
                }
				else {
                    respond(404, htmlTemplates.notFound(), 'text/html');
				}

			})
		},
		getCalendarItem: function(data, respond){

		},

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

			if(error && (error.code == "ENOENT")){
				respond(404, htmlTemplates.notFound(), 'text/html')
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

function createReadable(){
	var toPipe,
		readable,
		dataToRead;

    dataToRead = [].slice.call(arguments);

	readable = require('stream').Readable;
	toPipe = new readable();

    toPipe.push.apply(toPipe, dataToRead); // need to use .push method of RS, because no content will to read
    toPipe.push(null); // because , if no RS.push(null), then cache is null, so RS call ._read() to read. if RS.push(null) , mean is done.

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