const axios = require('axios');
const port = require('./share/port');

beforeAll(async () => {
    await axios.post(`http://localhost:${port}/db`);
});

test('Submit url and get a short code url', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes`,
        data: { url: 'https://www.movingworlds.org/user/48734577583393' }
    });
    expect(response.data.status).toBe('success');
});

test('Submit a different url and get a different short code', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes`,
        data: { url: 'https://www.movingworlds.org/user/15934577583393' }
    });
    expect(response.data.status).toBe('success');
});

test('Customize a short code url', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes`,
        data: { url: 'https://www.movingworlds.org/user/38734577583393', custom: "movingworlds" }
    });
    expect(response.data.status).toBe('success');
});

test('Choose a short code and get the short code if available', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes/choose`,
        data: { url: 'https://www.movingworlds.org/user/78734577583393', code: "5r76y" }
    });
    expect(response.data.status).toBe('success');
});

test('Redirect short code to the original url when clicked', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/5r76y`,
    });
    expect(response.data.status).toBe('success');
});

test('Redirect custom short code to the original when clicked', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/movingworlds/aaaaac`,
    });
    expect(response.data.status).toBe('success');
});

test('Get shortcode stats', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/5r76y/stats`,
    });
    expect(response.data.data).toHaveProperty('clicks');
    expect(response.data.data).toHaveProperty('access');
    expect(response.data.data).toHaveProperty('created');
});