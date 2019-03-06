//key 25d3244c-3196-4b56-9919-ede29bba0f4e
// This example is in Node ES6 using the request-promise library
const rp = require('request-promise');
const http = require('http');
// we can put require here only because we wrote 'export.' in the class
const cryptocoin = require('./Cryptocoin.js');
let coinsA = [];

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
// this var was for testing the remoting call
//let coin_data = undefined;

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
    if (coinsA) {
        res.end(JSON.stringify(coinsA));
    } else {
        res.end('No data');
    }
}).listen(8080);

// format for nodejs API given on coin site
rp(requestOptions).then(body => {
    let coin_data = body.data;
    //console.log(coin_data[1]); <-- ran this to see where price is stored
    // then tested here vv
    //console.log(coin_data[1].quote.USD.price);
    coin_data.forEach(coin => {
        coinsA.push(new cryptocoin.Cryptocoin(coin.id, coin.name, coin.quote.USD.price));
    });
    //coin_data = body.data;
    //console.log(coin_data);
}).catch((err) => {
    console.log('API call error:', err.message);
});

