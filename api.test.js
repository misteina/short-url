const axios = require('axios');
const port = require('./share/port');

beforeAll(async () => {
    await axios.post(`http://localhost:${port}/db`);
});

test('Submit url and get a short code url', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes`,
        data: { url: 'https://www.movingworlds.org/user/48734577583393', mode: "automatic" }
    });
    expect(response.data.status).toBe('success');
});

test('Submit a different url and get a different short code', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes`,
        data: { url: 'https://www.movingworlds.org/user/15934577583393', mode: "automatic" }
    });
    expect(response.data.status).toBe('success');
});

test('Choose a short code and get the short code if available', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shortcodes`,
        data: { url: 'https://www.movingworlds.org/user/78734577583393', custom: "movin", mode: "custom" }
    });
    expect(response.data.status).toBe('success');
});

test('Redirect short code to the original url when clicked', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/aaaaaa`,
    });
    expect(response.data.status).toBe('success');
});

test('Get shortcode stats', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/aaaaaa/stats`,
    });
    expect(response.data.data).toHaveProperty('clicks');
    expect(response.data.data).toHaveProperty('access');
    expect(response.data.data).toHaveProperty('created');
});