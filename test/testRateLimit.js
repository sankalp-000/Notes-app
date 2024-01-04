const axios = require('axios');

const payload = {
    "username": "ranjan2",
    "password": "123456",
    "email": "ranjan@gmail.com"
};

const testRateLimit = async () => {
    const endpoint = 'http://localhost:3000/api/auth/signup';

    try {
        console.log('\nWaiting for a minute before sending  requests to test rate limit...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        console.log('Sending 30 requests within 1 minute window to test rate limit...');
        for (let i = 1; i <= 30; i++) {
            const response = await axios.post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Request ${i} - Status: ${response.status}`);
        }

        console.log('Trying one more request to exceed the limit');
        try {
            const exceedingResponse = await axios.post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Exceeding rate limit Request - Status: ${exceedingResponse.status}`);
        }
        catch (err) {
            console.log(`Exceeding rate limit Request - Status: ${err.response ? err.response.status : err.message}`);
        }

    } catch (error) {
        console.log(`Error: ${error.response ? error.response.status : error.message}`);
    }
};

testRateLimit();
