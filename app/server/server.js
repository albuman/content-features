var http = require('http');
var fs = require('fs');
const port = 80;
const host = 'localhost';
function requestHandle(req, res){
   var html = fs.createReadStream('popup.html');
   html.on('readable', function(){
       var chunk = html.read();
       if(chunk){
           res.write(chunk, 'utf8')
       }

   });
   html.on('end', function(){
       res.end()
    })


}
function listenHandle(req, res){

}
var server = new http.createServer(requestHandle);
server.listen(port, host, listenHandle);
