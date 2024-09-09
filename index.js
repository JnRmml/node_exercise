var express = require('express');
var cors = require('cors');
var formidable = require('formidable');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function (req, res) {
  console.log("file");
  console.log("req:", req);
  var form = new formidable.IncomingForm();
  //console.log(form);
  form.parse(req, function (err, fields, files) {
	  console.log(files);
	  console.log(fields);
	  //var path = 
		let uploadedFile = files.upfile && files.upfile[0];

        // Die gewünschten Eigenschaften extrahieren
        let originalFilename = uploadedFile.originalFilename;
        let mimetype = uploadedFile.mimetype;
        let size = uploadedFile.size;
	  return res.json({ name: originalFilename, type: mimetype, size: size });
  });
  //res.sendFile(process.cwd() + '/views/index.html');
});



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
