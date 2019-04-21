let getToken = require("./getToken");
let getUserInfo = require('./getUserInfoByToken');
let config = require("../../config");

function callback(request, response) {
    (async function() {
        if (request.query.code === undefined || request.query.oauthFrom === undefined) {
            response.send("Lack of parameters");
            return null;
        }
        let token = await getToken(request.query.code,config.oauthURL.github.token,config.oauthInfo.github.client_id,config.oauthInfo.github.client_secret);
        if (token === null) {
            response.send("Error");
            return null;
        }
        let userInfo = await getUserInfo(token,config.oauthURL.github.userInfo);
        console.log(userInfo);
        response.redirect("https://www.google.com");
    })();
}

module.exports = callback;