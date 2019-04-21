let request = require('request-promise');
let log = require('../log');

/**
 * Get user's information by token
 * @param token
 * @param url
 * @returns {Promise<null|*>}
 */
async function getUserInfoByToken(token,url) {
    let response = await request({
        uri: url,
        qs: {
            access_token: token
        },
        headers: {
            'User-Agent': 'Sustainablility'
        }
    })
    .catch(err => {
        log.fatal("Request to oauth url failed " + url,err);
    });
    if (response === undefined) {
        return null;
    }
    let userInfo;
    try {
        userInfo = JSON.parse(response);
    }catch (e) {
        log.error("Failed to parse the user information","Failed to parse the user information by oauth to\n" + url);
        return null;
    }
    return userInfo;
}

module.exports = getUserInfoByToken;

//getUserInfoByToken("5b4e5ea05529cdbab2b78d98fb79249a55c75252","https://api.github.com/user");