let request = require('request-promise');
let querystring = require('querystring');
let log = require('../log');

async function getToken(code,url,clientID,clientSecret) {
    let response = await request({
        method: 'POST',
        uri: url + "?" + querystring.stringify({
            client_id: clientID,
            client_secret: clientSecret,
            code: code
        }),
        headers: {
            'User-Agent': 'Sustainablility'
        }
    })
    .catch(err => {
        console.log(err);
        log.fatal("Request to oauth url failed " + url,err);
    });

    console.log(code,url,clientID,clientSecret);
    if (response === undefined) {
        return null;
    }
    let token = querystring.parse(response).access_token;
    if (token === undefined) {
        log.error("Parsing access token failed","Parsing access token failed");
        return null;
    }
    console.log(token);
    return token;
}

exports.default = getToken;

getToken("9331c97909d6e252cfed","https://github.com/login/oauth/authorize","5171562b9c80c6c528f0","65d6a6dfa0e91ed1c66b37536da684bde0695c31");