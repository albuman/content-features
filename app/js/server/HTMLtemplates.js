var fs = require('fs');
var htmlContainer = require('./htmlContainer');

function notFound(){
	return fs.createReadStream('app/views/404.html');
}
function noAccess(){
	return fs.createReadStream('app/views/405.html');
}

module.exports = {
	noAccess,
	notFound,
	container: htmlContainer
};