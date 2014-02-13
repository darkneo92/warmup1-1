var express = require("express");
var app = express();
//Does this also do res.writeHead?
//app.use(express.logger()); //Adds the various headers to the conosole.

app.all('*', function(req,res,next) {
	res.writeHead(200, { "Content-Type": "text/plain" });
	console.log("All function");
	next();
});

app.get('/', function(req, res) {
  	res.send('Just Checking');
  	var t = req.get("Content-Type");
	console.log("T:" + t);
});
app.get('/about',function(req,res) {
	res.end("You've reached the about page!");
});
app.get("*",function(req, res) {
	res.write("DEFAULT var");
});
var port = 3000;
app.listen(port);
console.log("Listening on " + port);
