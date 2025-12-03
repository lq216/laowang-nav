const https = require('https');

https.get('https://nav.eooce.com/api/menus', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Data:', data.substring(0, 200) + '...');
    });
}).on('error', err => {
    console.error('Error:', err.message);
});
