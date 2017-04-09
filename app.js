var express = require('express');                 // nodejs framework
var bodyParser = require('body-parser');

var port = 8080;
var app = new express();
app.use(bodyParser.urlencoded({     // Needed to parse request bodies
  extended: true
}));
app.use(bodyParser.json());

// public files ==========================
// js, css, etc served in public folder
// Note: this is done before session initialize so when these files are
// accessed a session is not created
app.use(express.static('./public'));

// routes ================================
// Note: this is done after session initialization for a reason
// load our routes
require('./routes/routes.js')(app);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
