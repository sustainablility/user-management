let getToken = require("./getToken").default;
let getUserInfo = require('./getUserInfoByToken').default;
let config = require("../../config");

function callback(request, response) {
    (async function() {
        if (request.query.code === undefined || request.query.oauthFrom === undefined) {
            response.send("Lack of parameters");
            return null;
        }
        let token = await getToken(request.query.code,"https://github.com/login/oauth/authorize",config.oauthInfo.client_id,config.oauthInfo.client_secret);
        if (token === null) {
            response.send("Error");
            return null;
        }
        let userInfo = await getUserInfo(token,"https://api.github.com/user");
        console.log(userInfo);
        response.redirect("https://www.google.com");
    })();
}

exports.default = callback;