var http = require('http');
var fs = require('fs');
const port = 80;
const host = 'localhost';
function requestHandle(req, res, err){
    var requestedFile;
   if(req.url == '/'){
       requestedFile = fs.createReadStream('popup.html');
       
   } else {
       requestedFile = fs.createReadStream('.' + req.url);
   }
    requestedFile.on('readable', function(){
        var chunk = requestedFile.read();
        console.log(chunk);
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

}
var server = new http.createServer(requestHandle);
server.listen(port, host, listenHandle);
