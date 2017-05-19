var fs = require('fs');
var http = require('http');
var mime = require('mime');
var htmlTemplates = require('./HTMLtemplates');
var _ = require('lodash');

//to add additional sites in file "/data/resolvedSites.json", type in array \"new-web-site\" separated by comma
var resolvedSites = JSON.parse(require('./resolvedSites.json'));

const historyFilePath = 'data/historyLog.json';
const defaultPathFileName = 'data/defaultPaths.json';

function getPathFile(respond, callback) {
    var stats,
		defaultPath;


	try{
        defaultPath = require('../../../' + defaultPathFileName);
        if(defaultPath.folder && defaultPath.drive) {
            stats = fs.statSync(defaultPath.folder);
            if(stats.isDirectory()){
                if (callback) {
                    return callback(defaultPath);
                } else {
                	return defaultPath;
				}
			}

        }
    } catch (e) {
		respond(500, createReadable(e.message));
		console.error(e.message);
	}


}
function getHistoryFile(respond, callback){
	var stats,
		historyFile;


	try{
		stats = fs.statSync(historyFilePath);
		if(stats.isFile()){
            historyFile = require('../../../' + historyFilePath);
		}
	} catch(e){
		if(e.code === 'ENOENT' || (e instanceof SyntaxError)){
            fs.writeFileSync(historyFilePath, JSON.stringify({}));
            historyFile = require('../../../' + historyFilePath);
		} else {
			respond(500, createReadable(e.message))
		}
	}
	if(callback){
		return callback(historyFile)
	} else {
        return historyFile;
	}

}
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
            var defaultPath;

            if(!isNaN(Number(data))){
				defaultPath = getPathFile(respond);
                try{
                    recursiveCopyFolder(defaultPath.drive + '/' + data, defaultPath.folder+ '/' + data, respond);
                    respond(200, createReadable('Папка ' + data + ' успешно скопирована в ' + defaultPath.folder));
				} catch (err){
                    if(err && (err.code == 'ENOENT')){
                        respond(500, createReadable('Папка ' + data + ' не найдена в директории ' + defaultPath.drive));
                    } else {
                        respond(500, createReadable(err.message));
                    }
                }


			}
		},
		path: function(data, respond){
			if(data.drive || data.folder){

				fs.writeFile(defaultPathFileName, JSON.stringify(data, null, '\t'), function (err) {
					if(err){
                        respond(500, htmlTemplates.noAccess(), 'text/html');
					}
					else {
						respond(200, createReadable(defaultPathFileName + ' updated with: ' + JSON.stringify(data)))
					}
                })

			} else {
				respond(405, htmlTemplates.noAccess(), 'text/html')
			}
			
		},
		updateHistory: function (data, respond) {
			var historyFile = getHistoryFile(respond);

            updatedData = _.assignIn({}, historyFile, data);

            fs.writeFile(historyFilePath, JSON.stringify(updatedData, null, '\t'), function(error){
            	if(error){
                    respond(405, htmlTemplates.noAccess(), 'text/html');
				} else {
                    respond(200, createReadable('Updated'));
				}
			})

		},
        createDescription: function(data, respond){
			if(data.fileName && data.folderName){
				var defaultPath = getPathFile(respond);
				var main = defaultPath.folder + '/' + data.folderName;
				var mainFolderContent = [main, main+'/description', main+'/photos'];

				function needCallback(folder){
					return folder == mainFolderContent[1]
				}
				function writeFile(path){
                    fs.writeFile(path + '/' + data.fileName, data.text || '', function (err) {
                        if(err){
                            respond(500, createReadable(err.message));
                        } else {
                            respond(200, createReadable('Файл записан'))
                        }
                    })
				}
				function createFolders(path) {
					var stats;
					try {
						console.log(path);
						stats = fs.statSync(path);
						if (stats.isDirectory() && needCallback(path)) {
							writeFile(path)
						}
					} catch (err) {
						if (err && err.code == 'ENOENT') {
							fs.mkdirSync(path);
							console.log(err);
							if (needCallback(path)) {
								writeFile(path)
							}
							
						} else {
							respond(500, createReadable(err.message));
							
						}
						
					}
				}
				mainFolderContent.forEach(function (path) {
					createFolders(path);
				})
				
			} else {
                respond(500, createReadable('Не указано имя файла или имя папки!'))
			}
		},
		checkCurrentPosition: function(data, respond){
        	var defaultPaths;
        	
        	try{
        		defaultPaths = defaultPath = require('../../../' + defaultPathFileName);
        		fs.readdir(defaultPaths.folder, function(err, files){
        			if(err){
        				respond(500, createReadable(err.message));
					}else{
        				respond(200, createReadable(files.join(' ')));
					}
					
				})
			} catch(e){
        		console.log(e);
			}
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
						links = links.concat(files.map(function(file){
							return '<a href=' + path.replace('.', '') + '/' + file + '>' + file + '</a><br>'
						})).join('');
						
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
		
		
	},
	'OPTIONS': function(res){
        var headers = {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "POST, GET, OPTIONS",
            "Access-Control-Allow-Credentials" : false,
            "Access-Control-Allow-Headers": "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
		};

        res.writeHead(200, headers);
        res.end();
	}
	
};
function recursiveCopyFolder(drivePath, workFolderPath,  respond){
    var files,
		stats;

    stats = fs.statSync(drivePath);
    if(stats.isDirectory()){

        fs.mkdirSync(workFolderPath);
        files = fs.readdirSync(drivePath);
        files.forEach(function(file){
            recursiveCopyFolder(drivePath+'/'+file, workFolderPath+'/'+file, respond)
        });


    } else if(stats.isFile()){
        var encoding,
            readable,
            writable,
            isTextFormat;

        isTextFormat = /(.txt|.html|.htm|.doc|.docx)/.test(drivePath);
        encoding = isTextFormat ? 'utf-8' : 'binary';

        readable = fs.createReadStream(drivePath, encoding);
        writable = fs.createWriteStream(workFolderPath, encoding);

        readable.pipe(writable);
    }


}
function createReadable(){
	var toPipe,
		readable,
		dataToRead;

    dataToRead = [].slice.call(arguments);

	readable = require('stream').Readable;
	toPipe = new readable();
	toPipe.encoding = 'utf-8';

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