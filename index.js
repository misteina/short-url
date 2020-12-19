const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const app = express();
const port = require('./share/port');

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Shortens a provided long url
app.post('/shorten', require('./handlers/shorten'));

// Redirects a short code to orginal url
app.get('/:shortcode', require('./handlers/shortcode'));

// View short code stats
app.get('/:shortcode/stats', require('./handlers/stats'));

// Redirects a custom short code to original url 
app.get('/:custom/:shortcode', require('./handlers/custom'));

// Use a provided a short code if available
app.post('/usecode', require('./handlers/usecode'));

app.post('/dbreset', require('./database/reset'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});