/* start nodejs
* 1. npm init
* 2. npm i request --save (save makes it a local dependency)
* 3. ok, real coin site now uses npm request-promise
* 4. http is included with npm init
* 5. JSON.stringify was needed to parse data
* 6. To convert coins, the fn is sent to server, need urlrequest npm i url --save
* 7. Use url string to convert coins, see below
* 8. Run server - node index.js
*/
// this var was for testing the remoting call
//let coin_data = undefined;
//key 25d3244c-3196-4b56-9919-ede29bba0f4e
// This example is in Node ES6 using the request-promise library
const rp = require('request-promise');
// we can put require here only because we wrote 'export.' in the class
const cryptocoin = require('./Cryptocoin.js');
const http = require('http');
const url = require('url');
// from coins site
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

// the exports. syntax is specifically for nodejs
exports.Server = class {

    constructor(port) {

        this.port = port;
        this.coinsA = [];

        http.createServer((req, res) => {

            // functions are from npm i url --save
            const url_query = url.parse(req.url, true).query;
            const coin1_name = url_query.from;
            const coin2_name = url_query.to;

            // find coin objs
            let coin1 = undefined;
            let coin2 = undefined;

            // in the Zenva video, he has coin.id--incorrect
            this.coinsA.forEach((coin) => {
                if (coin.name === coin1_name) {
                    coin1 = coin;
                } else if (coin.name === coin2_name) {
                    coin2 = coin;
                }
            });

            res.writeHead(200, { 'Content-Type': 'text/plain' });

            // if both received, convert
            // to test in browser localhost:8080/?from=Bitcoin&to=Ethereum
            if (coin1 && coin2) {
                // use
                const conversion_factor = coin1.convert_to(coin2);
                res.end(coin1.name + ' costs ' + conversion_factor + ' ' + coin2.name + 's');
                //res.end(JSON.stringify(coinsA));
            } else {
                res.end('Could not find such coins');
            }

            // testing received data, see all coins.
            /* if (coinsA) {
                res.end(JSON.stringify(coinsA));
            } else {
                res.end('No data');
            } */
        }).listen(this.port);


        // format for nodejs API given on coin site
        rp(requestOptions).then(body => {
            let coin_data = body.data;
            //console.log(coin_data[1]); <-- ran this to see where price is stored
            // then tested here vv
            //console.log(coin_data[1].quote.USD.price);
            coin_data.forEach(coin => {
                this.coinsA.push(new cryptocoin.Cryptocoin(coin.id, coin.name, coin.quote.USD.price));
            });
            //coin_data = body.data;
            //console.log(coin_data);
        }).catch((err) => {
            console.log('API call error:', err.message);
        });
    }
}