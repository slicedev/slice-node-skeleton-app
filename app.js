var express = require('express');
var Slice = require('slice-node');
var url = require('url');

const type = 'OAuth';
const client_id = 'CLIENT_ID';
const client_secret = 'CLIENT_SECRET';
const redirect_uri = 'REDIRECT_URI';

var app = express();
var slice = new Slice(type, client_id, client_secret, redirect_uri);
/*
 * Refresh Token example method
 *
 */
app.get('/code', function(req, res){
  if(slice.auth.isExpired){
    slice.auth.authenticateWithRefreshToken(this.refresh_token);
    setTimeout(function(){
      printResponseData();
    }, 1000);
  }
  res.status(200);
});

/*
 * Redirects user to the Slice login screen
 *
 */
app.get('/', function(req, res){
  res.redirect(slice.auth.getAuthUrl());
});

/*
 * Authenticates with the auth code, and makes the "Hello World" call.
 * See http://devdocs.slice.com/resources/hello for more info.
 */
app.get('/callback', function(req, res){
  var param = url.parse(req.url, true);
  var code = param.query.code;
  slice.auth.authenticateWithAuthCode(code);
  setTimeout(function(){
    printResponseData();
    this.access_token = slice.auth.access_token;
    this.refresh_token = slice.auth.refresh_token;
    slice.request.setAccessToken(this.access_token);
    slice.request.users('GET','/self', null, function(error, response, body){
      res.status(200).send(body);
    });
  }, 2000);

});

/*
 * Private methods
 *
 * Prints token response data
 */
var printResponseData = function(){
  console.log('{ \n access_token : '+slice.auth.access_token +',\n refresh_token : '+slice.auth.refresh_token +', \n expiring at: '+slice.auth.expires_in+'\n } ');
}

/*
 * Starts server
 */
var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

});
