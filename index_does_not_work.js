const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const validUrl = require('valid-url');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const urlFilePath = path.join(__dirname, 'urls.json');

// Hilfsfunktion zum Laden der URLs aus der Datei
function loadUrls() {
  if (!fs.existsSync(urlFilePath)) {
    fs.writeFileSync(urlFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(urlFilePath);
  return JSON.parse(data);
}

// Hilfsfunktion zum Speichern der URLs in der Datei
function saveUrls(urls) {
  fs.writeFileSync(urlFilePath, JSON.stringify(urls, null, 2));
}

// POST-Anfrage zum Kürzen der URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  let urls = loadUrls();
  const existingUrl = urls.find(urlObj => urlObj.original_url === originalUrl);
  
  if (existingUrl) {
    return res.json({ original_url: existingUrl.original_url, short_url: existingUrl.short_url });
  }

  const shortUrl = urls.length + 1;
  const newUrl = {
    original_url: originalUrl,
    short_url: shortUrl
  };

  urls.push(newUrl);
  saveUrls(urls);

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// GET-Anfrage zum Weiterleiten der Kurz-URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const urls = loadUrls();
  const foundUrl = urls.find(urlObj => urlObj.short_url === shortUrl);

  if (foundUrl) {
    return res.redirect(foundUrl.original_url);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

// Server starten
const port = 3000;
app.listen(port, () => {
  console.log(`URL Shortener Microservice is running on port ${port}`);
});
