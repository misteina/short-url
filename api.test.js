const axios = require('axios');
const port = require('./share/port');

beforeAll(async () => {
    await axios.post(`http://localhost:${port}/dbreset`);
});

test('Submit url and get a short code url', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/shorten`,
        data: { url: 'https://www.movingworlds.org/user/48734577583393' }
    });
    expect(response.data.status).toBe('success');
});

test('Submit short code and get the short code url', async () => {
    const response = await axios({
        method: 'post',
        url: `http://localhost:${port}/usecode`,
        data: { url: 'https://www.movingworlds.org/user/78734577583393', code: "5r76y" }
    });
    expect(response.data.status).toBe('success');
});

test('Redirect short code to original when clicked', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/5r76y`,
    });
    expect(response.data.status).toBe('success');
});

test('Get shortcode statistics', async () => {
    const response = await axios({
        method: 'get',
        url: `http://localhost:${port}/5r76y/stats`,
    });
    console.log(response.data)
    expect(response.data.data).toHaveProperty('clicks');
    expect(response.data.data).toHaveProperty('access');
    expect(response.data.data).toHaveProperty('created');
});