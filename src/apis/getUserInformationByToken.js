let log = require('../log');
let User = require('../user/index');
async function userInfo(request,response) {

    // Parameter existed
    if (request.query.token === undefined) {
        response.status(400).send("Token required");
        return null;
    }

    // Parameter length
    if (request.query.token.length > 50) {
        response.status(400).send("Parameters are too long");
        return null;
    }


    let user = new User();
    let loginResult = await user.getUserByToken(request.query.token);

    // Result check
    if (loginResult !== 0) {
        log.access("Get user information by token failed","Token not correct",request.ip,"anonymous");
        response.status(400).send("Token Error");
        return null;
    }
    log.access("Get user information by token success","get user information success",request.ip,user.identity);
    response.send(JSON.stringify(user.packingUserInformation()));
}

module.exports = userInfo;