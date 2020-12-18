const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/:shortcode', require('./handlers/shortcode'));
app.get('/:shortcode/stats', require('./handlers/stats'));
app.post('/shorten', require('./handlers/shorten'));
app.post('/usecode', require('./handlers/usecode'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});