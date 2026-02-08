const https = require('https');

const options = {
    hostname: 'api.ambeedata.com',
    path: '/weather/latest/by-lat-lng?lat=28.6139&lng=77.2090',
    method: 'GET',
    headers: {
        'x-api-key': '292493461224775c3387b23295ae16fc478e983a4934d6ad4d4b8cc47631f16a',
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
