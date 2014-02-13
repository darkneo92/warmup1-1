var express = require("express");
var mysql = require('mysql');
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
var UNCAUGHT_ERROR = 0;

var connection = mysql.createConnection({
  host     : 'us-cdbr-east-05.cleardb.net',
  user     : 'bf056c0869c4c7',
  password : 'f5ee0f85',
  database : 'heroku_77abfd0275622df'
});
connection.connect();

function add(user, password, callback) {
    if (typeof(user) == "undefined") {
      return ERR_BAD_USERNAME;
    } else {
      if (user.length === 0 || user.length > MAX_USERNAME_LENGTH) {
        callback(ERR_BAD_USERNAME);
      } else {
          if (password.length > MAX_PASSWORD_LENGTH) {
            callback(ERR_BAD_PASSWORD);
          } else {
              var returnCode;
              var count = 1; //Starting value for count
              var sql = "INSERT INTO `heroku_77abfd0275622df`.`users` (user, password, count) VALUES (?,?,?)";
              connection.query(sql, [user,password,count], function(err, rows, fields){
                returnCode = count;
                if (err) {
                  returnCode = UNCAUGHT_ERROR; 
                  if (err['code'] == 'ER_DUP_ENTRY') {
                      returnCode = ERR_USER_EXISTS;
                  } 
                } 
                callback(returnCode);
          });
      }
    }
  }
}

function login(user, password, callback) {
  var returnCode;
	var statement = "SELECT count FROM `heroku_77abfd0275622df`.`users` WHERE user = ? AND password = ?";
	connection.query(statement,[user,password], function(err, rows, fields) {
    if (err) {
      callback(UNCAUGHT_ERROR);
    } else {
      if (rows.length == 0) {
        callback(ERR_BAD_CREDENTIALS);
      } else {
        var update = "UPDATE `heroku_77abfd0275622df`.`users` SET `count`= ? WHERE `user`=?";
        var newCount = rows[0]['count'] + 1;
        connection.query(update,[newCount, user], function(err,rows,fields) {
            if (err) {
              returnCode = UNCAUGHT_ERROR;
            } else {
              returnCode = newCount;
            }
            callback(returnCode);
        });
      }
    }
  });
}

function TESTAPI_resetFixture(callback) {
  var sql = 'DELETE FROM `heroku_77abfd0275622df`.`users`;'
  connection.query(sql, function(err, rows, fields) {
    returnCode = SUCCESS;
    if (err) {
      returnCode = UNCAUGHT_ERROR;
    }
    callback(returnCode);
  });
  
};

exports.add = add;
exports.login = login;
exports.TESTAPI_resetFixture = TESTAPI_resetFixture;
