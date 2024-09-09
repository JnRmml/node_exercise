const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
var crypto = require('crypto');
require('dotenv').config();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users/:_id/exercises", (req, res) => {
	//You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
	console.log("post", req.params._id);
	let id = req.params._id;
	let desc = req.body.description;
	let dur = parseInt(req.body.duration); //vlt isNaN Prüfung?
	//let date = .toDateString();
	let date = new Date(Date.now()).toDateString();
	if (req.body.date != undefined && req.body.date != ""){
		let given_date = new Date(req.body.date);
			if (!isNaN(given_date.getTime())) {  // Prüfen, ob das Datum gültig ist
			date = given_date.toDateString();  // Nur wenn gültig, das Datum setzen
		}
	}
	console.log("eingabe id", id, desc, dur, date );
	console.log("eingabe id", req.params._id, req.body.description, req.body.duration, date );
	if (id != undefined && desc != undefined && desc != "" && ! isNaN(dur) && dur != undefined && date != undefined ) {
	
	let new_log = {
    "description": desc,
    "duration": dur,
    "date": date
	}
	console.log(new_log);
	//log einfügen
	//json laden
	fs.readFile('exercise.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
       return;
	}
	//console.log(data);
	let user_obj = JSON.parse(data);
	//console.log(user_obj);
	//id suchen
	let user_gefunden = -1;
	for(let i = 0; i < user_obj.length; i++)  {
		if(user_obj[i]._id == id){
			user_gefunden = i;
			break;
		}
	}
	if (user_gefunden < 0){
		return res.json({error : "No such user", id : id});
	} else {
	//log in log-Array anfügen, count inkrementieren
	user_obj[user_gefunden].log.push(new_log);
	user_obj[user_gefunden].count++;
	//speichern 
	fs.writeFile('exercise.json', JSON.stringify(user_obj), function (err) {
		if (err) throw err;
		console.log('Saved!');
	 console.log("neue exercise:", {
            _id: user_obj[user_gefunden]._id,
            username: user_obj[user_gefunden].username,
            date: new_log.date,
            duration: new_log.duration,
            description: new_log.description
            });
		//return res.json(user_obj[user_gefunden]);
		return res.json({
            _id: user_obj[user_gefunden]._id,
            username: user_obj[user_gefunden].username,
            date: new_log.date,
            duration: new_log.duration,
            description: new_log.description
            });
		});
	}
	});	
	} else {
		console.log(id, typeof id);
	if (id != undefined && id != "") {
		console.log("Route interessant", id);
		//suche User mit id 
		fs.readFile('exercise.json', 'utf8', (err, data) => {
		if (err) {
		console.error(err);
		return;
		}
			console.log("noesi");
			console.log(data);
			let user_obj = JSON.parse(data);
			console.log("userob:", user_obj);
			//id suchen
			let user_gefunden = -1;
			for(let i = 0; i < user_obj.length; i++)  {
				console.log ("ids", user_obj[i]._id, id, user_obj[i]._id == id);
				if(user_obj[i]._id == id){
					user_gefunden = i;
					break;
				}
			}
			if (user_gefunden < 0){
				console.log("Nicht gefunden");
			return res.json({error : "No such user", id : id});
		}else {
		/*console.log("neue exercise:", {
            _id: user_obj[user_gefunden]._id,
            username: user_obj[user_gefunden].username,
            date: new_log.date,
            duration: new_log.duration,
            description: new_log.description
            });*/
		//return res.json(user_obj[user_gefunden]);
		return res.json({
            _id: user_obj[user_gefunden]._id,
            username: user_obj[user_gefunden].username,
            date: new_log.date,
            duration: new_log.duration,
            description: new_log.description
            });
		}
		});
	}else {
				console.log("Nicht gefunden und id undefined");
		return res.json({error : "No such user", id : id});
	}
	}
});


app.post("/api/users", (req, res) => {
	console.log("post", req.body.username);
	let user_name = req.body.username;
	//let hash = crypto.createHash('md5').update(user_name).digest('hex');
	let hash = uuidv4(); 
	let new_user = { username : user_name, count : 0, _id: hash, log : [] };
	console.log(new_user);
	fs.readFile('exercise.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
       return;
	}
	console.log(data);
	let user_obj = JSON.parse(data);
	//console.log(user_obj);
	user_obj[user_obj.length] = new_user;
	//Speichern
	fs.writeFile('exercise.json', JSON.stringify(user_obj), function (err) {
		if (err) throw err;
		console.log('Saved!');
	 
	console.log("neuer User:", user_obj);
	return res.json(new_user);
	});
	});
});


app.get("/api/users/:_id/logs", (req, res) => {
	//log von einem Nutzer zurückgeben
	let id = req.params._id; 
	//json laden 
	fs.readFile('exercise.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
       return;
	}
	
	let user_obj = JSON.parse(data);
	//id suchen
	let user_gefunden = -1;;
	for(let i = 0; i < user_obj.length; i++)  {
		if(user_obj[i]._id == id){
			user_gefunden = i;
			break;
		}
	}
	if (user_gefunden < 0){
		return res.json({error : "No such user", id : id});
	} else {
	//16. You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
	let from = new Date(req.query.from);
	let to = new Date(req.query.to);
	let limit = parseInt(req.query.limit);

	console.log("from to limit", from, to, limit);
	// Überprüfe, ob die Parameter gesetzt sind und ob das Datum von <= bis Datum bis
	if (isNaN(limit)){ limit = Infinity; }// Wenn limit nicht gesetzt ist, keinen Limit setzen

	if (from > to) {
		// Wenn das 'from' Datum nach dem 'to' Datum liegt, keine Logs zurückgeben
		return res.json({ count: user_obj[user_gefunden].count, log: [] });
	}

	let filterlog = [];
	let logEntries = user_obj[user_gefunden].log;

	for (let j = 0; j < logEntries.length && limit > 0; j++) {
		let logDate = new Date(logEntries[j].date);
    if (( isNaN(from) || logDate >= from) && ( isNaN(to) || logDate <= to)) {
        filterlog.push(logEntries[j]);
        limit--;
    }
}

// Zurückgeben der gefilterten Logs
return res.json({ count: user_obj[user_gefunden].count, log: filterlog });

	} 
});
});
/*
app.get("/api/users", (req, res) => {
	console.log("get", req.body.username);
});
*/


app.get("/api/users", (req, res) => {
	//alle User laden und zurückgeben
	//vlt muss das nochmal vorbereitet werden durch das Herausfiltern von username und id
	//Ausgabe soll ein Array sein
	fs.readFile('exercise.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
       return;
	}
	console.log(data);
	let user_obj = JSON.parse(data);
	return res.json(user_obj);
	});
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
