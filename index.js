//key 25d3244c-3196-4b56-9919-ede29bba0f4e
// This example is in Node ES6 using the request-promise library
const rp = require('request-promise');
const http = require('http');

/* start nodejs
* 1. npm init
* 2. npm i request --save
* 3. ok, real coin site now uses npm request-promise
* 4. http is included with npm init
* 5. JSON.stringify was needed to parse data
*
*
*
*/

let coin_data = undefined;

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        start: 1,
        limit: 10,
        convert: 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': '25d3244c-3196-4b56-9919-ede29bba0f4e'
    },
    json: true,
    gzip: true
};

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    if (coin_data) {
        res.end(JSON.stringify(coin_data));
    } else {
        res.end('No data');
    }
}).listen(8080);

// format given on coin site
rp(requestOptions).then(body => {
    //console.log('API call response:', response);
    coin_data = body.data;
    console.log(coin_data);
}).catch((err) => {
    console.log('API call error:', err.message);
});

