var express = require("express");
var mysql = require('mysql');
var model = require('./UserModel');
var app = express();
app.use(express.logger()); //Adds the various headers to the conosole.
app.use(express.bodyParser());

//Error Codes
var SUCCESS = 1;
var ERR_BAD_CREDENTIALS = -1;
var ERR_USER_EXISTS = -2;
var ERR_BAD_USERNAME = -3;
var ERR_BAD_PASSWORD = -4;
var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;


var connection = mysql.createConnection({
  host     : 'us-cdbr-east-05.cleardb.net',
  user     : 'bf056c0869c4c7',
  password : 'f5ee0f85',
  database : 'heroku_77abfd0275622df'
});
connection.connect();

//This function logs an existing user in.
app.post('/', function(request, response) {
  var user = request.body.user;
  var password = request.body.password;
  console.log("POST/ User: " + user + "\nPassword: " + password);
	var statement = "SELECT count FROM `heroku_77abfd0275622df`.`users` WHERE user = ? AND password = ?";
	connection.query(statement,[user,password], function(err, rows, fields) {
    if (err) throw err;
    if (rows.length == 0) {
      response.send("No such user\n");
      return ERR_BAD_CREDENTIALS;
    } else {
      var update = "UPDATE `heroku_77abfd0275622df`.`users` SET `count`= ? WHERE `user`=?";
      var newCount = rows[0]['count'] + 1;
      connection.query(update,[newCount, user], function(err, rows, fields) {
        if (err) {
          console.log('error: ', err);
          throw err;
        }
      });
      var message = "Welcome " + user +". You have logged in " + newCount.toString() + " times\n";
      response.send(message);
      return newCount;
    }
  });
});

//Adds a new user and makes sure that user doesn't already exist in the dB.
app.post('/new_user',function(req, res) {
    var count = 1; //Starting value for count
    var user = req.body.user;
    var password = req.body.password;
    if (user.length === 0 || user.length > MAX_USERNAME_LENGTH) return ERR_BAD_USERNAME;
    if (password.length > MAX_PASSWORD_LENGTH) return ERR_BAD_PASSWORD;
    console.log("User: " + user + "\nPassword: " + password);
    var sql = "INSERT INTO `heroku_77abfd0275622df`.`users` (user, password, count) VALUES (?,?,?)";
    connection.query(sql, [user,password,count], function(err, rows, fields) {
    if (err) {
      console.log('error: ', err);
      if (err['code'] == 'ER_DUP_ENTRY') {
        res.send("This user already exists\n");
        return ERR_USER_EXISTS;
      } else {
        err.throw; 
      }
    }
    res.send('Added a new row!');
    return count;
  });
});

//Deletes all the rows in the dB
app.get('/delete',function(req, res) {
    console.log("DELETE ALL");
    var sql = 'DELETE FROM `heroku_77abfd0275622df`.`users`;'
    connection.query(sql, function(err, rows, fields) {
      if (err) {
        console.log('error: ', err);
        throw err;
      }
      res.send('Deleted all rows!');
      return SUCCESS;
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

//TO DO:
// Need to check for user