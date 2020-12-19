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
app.post('/shortcodes', require('./handlers/generate_short_code'));

// Redirects a short code to orginal url
app.get('/:shortcode', require('./handlers/redirect_to_original_url'));

// View short code stats
app.get('/:shortcode/stats', require('./handlers/stats'));

app.post('/db', require('./database/reset'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});