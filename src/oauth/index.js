let getToken = require("./getToken");
let getUserInfo = require('./getUserInfoByToken');
let config = require("../../config");
let oauthDataHandle = require('./handleDataFromOauth');
let log = require('../log');

function callback(request, response) {
    (async function() {
        if (request.query.code === undefined || request.query.oauthFrom === undefined) {
            response.send("Lack of parameters");
            return null;
        }
        if (request.query.code.length > 50  || request.query.oauthFrom.length > 50) {
            response.send("Parameters are too long");
            return null;
        }
        let token = await getToken(request.query.code,config.oauthURL.github.token,config.oauthInfo.github.client_id,config.oauthInfo.github.client_secret);
        if (token === null) {
            response.send("Error");
            return null;
        }
        let userInfo = await getUserInfo(token,config.oauthURL.github.userInfo);
        let userToken = null;
        switch (request.query.oauthFrom) {
            case "github":
                log.access("Oauth login success","Github oauth login success",request.ip,"github" + userInfo.id);
                userToken = await oauthDataHandle(userInfo);
                break;
            case "google":
                break;
            default:
                break;
        }
        if (userToken === null) {
            response.status(400).send("error");
            log.error("Oauth login error","Oauth login error by IP " + request.ip);
        }else {
            response.send(userToken);
        }
    })();
}

module.exports = callback;