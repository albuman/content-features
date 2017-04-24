var http = require('http');
var fs = require('fs');
const port = 4444;
const host = 'localhost';
function requestHandle(req, res, err){
    var requestedFile;
   if(req.url == '/'){
       requestedFile = fs.createReadStream('index.html');
       
   } else {
       requestedFile = fs.createReadStream('.' + req.url);
   }
    requestedFile.on('readable', function(){
        var chunk = requestedFile.read();
        if(chunk){
            res.write(chunk, 'utf8')
        }

    });
    requestedFile.on('end', function(){
        res.end()
    });
    if(err){
        console.log(err)
    }

}
function listenHandle(req, res){
    console.log("start listen on " + host + ':' + port);
}
var server = new http.createServer(requestHandle);
server.listen(port, host, listenHandle);
