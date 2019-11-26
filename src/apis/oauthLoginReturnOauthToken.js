let encryption = require("../microservice-communication-encryption/index");
let User = require('../user/index');
let log = require('../log');

async function oauthLoginReturnOauthToken(request, response) {
    // Parameter existed
    if (request.query["id"] === undefined || request.query["email"] === undefined) {
        response.status(400).send("Token required");
        return null;
    }

    // Parameter length
    if (request.query["id"].length > 100 || request.query["email"].length > 100) {
        response.status(400).send("Parameters are too long");
        return null;
    }


    let userID = encryption.decrypt(request.query["id"]);
    let email = encryption.decrypt(request.query["email"] );


    if (userID === null) {
        response.status(400).send("decription failed");
        return null;
    }

    let user = new User(userID, email);
    let token = await user.oauthLogin().catch(err => {
        log.fatal("Error when oauth login", err);
    });
    if (token === undefined) {
        response.status(500).send("Server Error");
        return null;
    }
    response.send(encryption.encrypt(token));
}

module.exports = oauthLoginReturnOauthToken;