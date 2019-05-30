let encryption = require('../microservice-communication-encryption/index');
let User = require('../user/index');
let log = require('../log');

async function getID(request,response) {
    if (request.query.token === undefined) {
        response.send("Token required");
        return null;
    }
    if (request.query.token.length > 50) {
        response.send("Parameters are too long");
        return null;
    }
    let databaseToken = encryption.decrypt(request.query.token);
    if (databaseToken === null) {
        response.send("Decrypting Token Error");
        return null;
    }
    let user = new User();
    let loginResult = await user.getUserByDatabaseToken(databaseToken);
    if (loginResult === 1) {
        log.access("Get user ID by database token failed","Database Error",request.ip,"anonymous");
        response.status(500).send("Internal Error");
        return null;
    }
    if (loginResult === 2) {
        log.access("Get user ID by database token failed","Token Error",request.ip,"anonymous");
        response.status(400).send("Token Error");
        return null;
    }
    log.access("Get user ID by database token success","get user ID success",request.ip,user.identity);
    response.send(encryption.encrypt(user.identity));
}

module.exports = getID;