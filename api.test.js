const axios = require('axios');
const port = require('./share/port');

beforeAll(async () => {
    await axios.post(`http://localhost:${port}/reset`);
});

test('Get a short url', async () => { 
    try {
        const response = await axios({
            method: 'post',
            url: `http://localhost:${port}/shorten`,
            data: { url: 'http://localhost:3000/user/48734577583393' }
        });
        expect(response.data.status).toBe('success');
        console.log(response.data.status)
    } catch (error) {
        console.error(error);
    }
});