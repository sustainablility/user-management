let request = require('request-promise');
let querystring = require('querystring');
let log = require('../log');

/**
 * Get oauth Token
 * @param code code from oauth
 * @param url oauth's URL for getting token
 * @param clientID
 * @param clientSecret
 * @returns {Promise<null|string | string[]>}
 */
async function getToken(code,url,clientID,clientSecret) {
    let response = await request({
        method: 'POST',
        uri: url,
        form: {
            client_id: clientID,
            client_secret: clientSecret,
            code: code
        }
    })
    .catch(err => {
        log.fatal("Request to oauth url failed " + url,err);
    });
    if (response === undefined) {
        return null;
    }
    let token = querystring.parse(response).access_token;
    if (token === undefined) {
        log.error("Parsing access token failed","Parsing access token failed");
        return null;
    }
    return token;
}

module.exports = getToken;

//getToken("30293520f8173ce93b8f","https://github.com/login/oauth/access_token","5171562b9c80c6c528f0","65d6a6dfa0e91ed1c66b37536da684bde0695c31");