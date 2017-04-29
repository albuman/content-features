var fs = require('fs');

function notFound(){
	return fs.createReadStream('app/views/404.html');
}
function noAccess(){
	return fs.createReadStream('app/views/405.html');
}
function htmlContainer (html) {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>HTML Container</title>
                <style>
                    body{
                       font: 2em normal Helvetica, sans-serif;
                       background-color: #eee;
                    }
                    a {
                        text-decoration: none;
                        color: black;
                    }
                    body>div{
                        padding: 1em;
                        
                    }
                    
                </style>
            </head>
            <body>
                <div>
                    ${html}	
                </div>
                
            </body>
            </html>`
};

module.exports = {
	noAccess,
	notFound,
	container: htmlContainer
};