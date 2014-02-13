var express = require("express");
var mysql = require('mysql');
var app = express();
var model = require('./UserModel');
app.use(express.bodyParser());


app.get('/',function(req, res) {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end('Hello World!');
});

app.post('/users/login', function(req, res) {
	var user = req.body.user;
    var password = req.body.password;
	model.login(user,password, function(returnCode) {
		console.log("Return Code: " + returnCode.toString());
		sendJSON(res,returnCode);
	});
});

app.post('/users/add',function(req, res) {
	var user = req.body.user;
    var password = req.body.password;
    console.log("User: " + user + "\nPassword: " + password);
	var rC = model.add(user,password, function(returnCode){
		console.log("returnCode: " + returnCode.toString());
		sendJSON(res,returnCode);
	});
	if (rC != undefined && rC != null) {
		sendJSON(res, rC);
	}
});

function sendJSON(res,returnCode) {
	if (returnCode < 0) {
		var json = {'errCode':returnCode};
		res.setHeader('Content-Type', 'application/json');			
		res.end(JSON.stringify(json, null, 3));
	} else if (returnCode > 0) {
		var json = {'errCode':1,'count':returnCode}; //the returnCode in this case is actually just the number of log-ins
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(json, null, 3));
	} else {
		res.writeHead(500);
		res.end("Uncaught Error! Something went terribly wrong");
	}	
}

app.post('/TESTAPI/resetFixture', function(req, res) {
	model.TESTAPI_resetFixture(function(returnCode) {
		console.log("Everything is deleted");
		if (returnCode !== 0) {
			json = {'errCode':returnCode};
			res.setHeader('Content-Type', 'application/json');			
			res.end(JSON.stringify(json, null, 3));
		} else {
			res.writeHead(500);
			res.end("Uncaught Error! Something went terribly wrong");
		}
	})
})

app.post('/TESTAPI/unitTests', function(req, res) {

})

calculate = function (num) {
    if (typeof num === 'number') {
         return num * 2;
    }
    else {
        throw new Error('Expected a number');
    }
};

exports.calculate = calculate;

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});