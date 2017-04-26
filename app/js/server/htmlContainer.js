function htmlContainer (html) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>404 Not found</title>
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

module.exports = htmlContainer;