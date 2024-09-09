require('dotenv').config();
const dns = require('node:dns'); 
const bodyParser = require('body-parser');
 const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urls_obj = {};
/**/

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
	
// GET
app.get('/api/shorturl/:url1?', function(req, res) {
	//console.log("get", req.params.url1);
	//console.log(req.params.url1);
	//json laden 
	let url_num = parseInt(req.params.url1);
	fs.readFile('urls.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
       return;
	}
	urls_obj = JSON.parse(data);
	//console.log("erg:", urls_obj);
	//console.log("erg2:", urls_obj);
	//json abfrage
	let j = 0;
	for(j = 0; j < urls_obj.length; j++){
	  if (urls_obj[j].short_url == url_num){
		  //console.log("gefunden:", urls_obj[j].short_url);
		  return res.redirect(urls_obj[j].original_url);
		  break;
	  }
  }
  if ( j >= urls_obj.length || url_num == undefined || isNaN( url_num  ) ){
		//console.log("get invalid url");
		return res.json({ error : 'invalid url' });
  }
  /**/
			console.log("Route valid url");
	/*
	*/
	/**/
	});
});


//https://www.freecodecamp.org/news/building-a-simple-url-shortener-with-just-html-and-javascript-6ea1ecda308c/
app.post('/api/shorturl', function(req, res) {
	console.log("post", req.body.url);
	//console.log(req.body.url.substring(0,7));
	//Url testen, muss mit http anfangen
	if (req.body.url.substring(0,7) != "http://" && req.body.url.substring(0,8) != "https://"){
		
		  //console.log("Invalid");
		return res.json({ error : 'Invalid URL', url: req.body.url })
	}
	//url vorbereiten
	let search = req.body.url;
	//console.log(search.substring(search.length-1, search.length));
	if (search.substring(search.length-1, search.length) == '/'){
		//console.log(search);
		search = search.substring(0, search.length-1);
	}
	
	//json laden 
	fs.readFile('urls.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
       return;
	}
	urls_obj = JSON.parse(data);
	//console.log("erg:", urls_obj);
	//console.log("erg2:", urls_obj);
	//json abfrage
	let j = 0;
	for(j = 0; j < urls_obj.length; j++){
	  if (urls_obj[j].original_url == search){
		  //console.log("gefunden j:", urls_obj[j].original_url);
		  //console.log("return j:", urls_obj[j].original_url,  urls_obj[j].short_url);
		  return res.json({ original_url : urls_obj[j].original_url, short_url: urls_obj[j].short_url });
		  break;
	  }
	}
	
	if (j >= urls_obj.length){
		//Adresse zu einen selbst (localhost)
		//http://localhost:3000
		if (search.substring(0,21) == "http://localhost:3000"){
			//return res.json({ error : 'Invalid URL', url: req.body.url })
			let t = 0;
			for(t = 0; t < urls_obj.length; t++){//.substring(0,21)
			if (urls_obj[t].original_url == search){
				//console.log("return j:", urls_obj[t].original_url,  urls_obj[t].short_url);
				return res.json({ original_url : urls_obj[t].original_url, short_url: urls_obj[t].short_url });
				break;
			}
		}
			
			//shorturl erzeugen
			//zufallszahl
			console.log("look:", search.substring(0,21));
			let new_url_eig = Math.floor((Math.random() * 99999) + 1); 
			t = 0;
			for(t = 0; t < urls_obj.length; t++){
				if (urls_obj[t].short_url == new_url_eig){
					//wenn die short_url schon vergeben ist, dann rechne +1 auf und such nochmal von Vorne
					//console.log("gefunden:", urls_obj[t].short_url);
					new_url_eig++;
					t = 0;
				}
			}
			//short_url ist nicht enthalten, also einfügen und zurückgeben .substring(0,21)
			urls_obj[urls_obj.length] = { original_url : search, short_url: new_url_eig };
			//Speichern
			fs.writeFile('urls.json', JSON.stringify(urls_obj), function (err) {
			if (err) throw err;
				console.log('Saved!');
			}); 
			 //console.log("return j:", urls_obj); //.substring(0,21)
			return res.json({ original_url : search, short_url: new_url_eig });	
		}
		//short url erzeugen
		//ist die url legitim? --> DNS Probe
		const options = { 
			all:true, 
		}; 
		let domain;
		console.log(search);
		//url umbauen, da dns.lookup nur Domainnames abfragt
		if (search.substring(0,7) == "http://"){
			domain = search.substring(7);
		}
		if (search.substring(0,8) == "https://"){
			domain = search.substring(8);
		}
		console.log(domain);		
		dns.lookup(domain, options , (err, address) => {  
        console.log('address: %j', address);  
		if (err) {
                console.log("dns error:", err);
                return res.json({ error: 'invalid url' , message: 'DNS lookup failed' });
		}
		if(address !== undefined && Array.isArray(address) && address.length > 0 && address != "undefined"){
			//shorturl erzeugen
			//zufallszahl
			let new_url = Math.floor((Math.random() * 99999) + 1); 
			let k = 0;
			for(k = 0; k < urls_obj.length; k++){
				if (urls_obj[k].short_url == new_url){
					//wenn die short_url schon vergeben ist, dann rechne +1 auf und such nochmal von Vorne
					//console.log("gefunden:", urls_obj[k].short_url);
					new_url++;
					k = 0;
				}
			}
			//short_url ist nicht enthalten, also einfügen und zurückgeben
			urls_obj[urls_obj.length] = { original_url : search, short_url: new_url };
			//Speichern
			fs.writeFile('urls.json', JSON.stringify(urls_obj), function (err) {
			if (err) throw err;
				console.log('Saved!');
			}); 
			 //console.log("return j:", urls_obj);
			return res.json({ original_url : search, short_url: new_url });
		
			}
		});
		}
	
	});
	
	
	//console.log("req:", req);
	//console.log(req.body);
	/**/
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
