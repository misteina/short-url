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

app.post('/shorten', require('./handlers/shorten'));
app.get('/:shortcode', require('./handlers/shortcode'));
app.get('/:shortcode/stats', require('./handlers/stats'));
app.get('/:custom/:shortcode', require('./handlers/custom'));
app.post('/usecode', require('./handlers/usecode'));
app.post('/dbreset', require('./database/reset'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});