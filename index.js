// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
//var dt = require('./DateTime');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/", function (req, res) {
	res.json({ unix : Date.now() , utc : new Date(Date.now()).toUTCString()});
	}
	);


// your first API endpoint... 
app.get("/api/:date", function (req, res) {
	/*if(req.params.date == ""){
		res.json({ unix : Date.now() , utc : Date.now().toUTCString()});
	}*/
	
	let dt = new Date(parseInt(req.params.date));
	//console.log(dt);
	//if (!(dt instanceof Date && isNaN(req.params.date))){ //&& !isNaN(dt)
	if(dt instanceof Date && !isNaN(dt.valueOf()) ) {
	if(!(isNaN (req.params.date))){
		//dt = parseInt(req.params.date);
		//console.log(dt, req.params.date);
		res.json({unix: dt.valueOf(), utc: new Date(dt).toUTCString() });
	}
	else {
	//res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write("Das das Datum und Zeit sind momentan: " + dt.myDateTime());
  //res.json({greeting: 'hello API'});
  //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //const weekdays = ["Mon", "Thu", "Wed", "Tru", "Fri", "Sa", "So"];/**/
  dt = new Date(req.params.date);
  //if (dt instanceof Date && !isNaN(d))
  //const wday = dt.getDay();
  //const day = dt.getDate();
  //const month = dt.getMonth(); 
  //const year = dt.getFullYear();
  //const hours = dt.getHours() < 10 ? "0"+dt.getHours() : dt.getHours() ; 
  //const min = dt.getMinutes() < 10 ? "0"+dt.getMinutes() : dt.getMinutes() ; 
  //const sec = dt.getSeconds() < 10 ? "0"+dt.getSeconds() : dt.getSeconds() ; 
  //const timezone = dt.getTimezoneOffset();/**/
  //console.log(dt.valueOf()+" "+weekdays[wday]+", "+ day+" "+months[month]+" "+year+" "+hours+":"+min+":"+sec+" GMT");
  res.json({unix: Date.parse(req.params.date), utc: dt.toUTCString()});
  //res.json({unic: Date.parse(req.params.date), utc: wday+", "+ day+" "+months[month]+" "+year+" "+(hours)+":"+min+":"+sec+" "+timezone});
  //res.end();
	}
	
	} else {
		res.json({ error : "Invalid Date" });
	}
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
