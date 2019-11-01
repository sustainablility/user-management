let log = require('../log');
let User = require('../user/index');
let encryption = require("../microservice-communication-encryption/index");
async function addProcedure(request,response) {

    // Parameter existed
    if (request.query["token"] === undefined) {
        response.status(400).send("Token required");
        return null;
    }
    if (request.query["procedure"] === undefined) {
        response.status(400).send("Procedure required");
        return null;
    }

    // Parameter length
    if (request.query["token"].length > 100) {
        response.status(400).send("Parameters are too long");
        return null;
    }
    let decryptedToken = encryption.decrypt(request.query["token"]);
    if (decryptedToken === null) {
        response.status(400).send("Token invalid");
        return null;
    }
    let decryptedProcedure = encryption.decrypt(request.query["procedure"]);
    if (decryptedProcedure === null) {
        response.status(400).send("Procedure Invalid")
    }

    let user = new User();
    let loginResult = await user.getUserByToken(decryptedToken);

    // Result check
    if (loginResult === 1) {
        response.status(500).send("Internal Error");
        return null;
    }
    if (loginResult === 2) {
        response.status(400).send("User Does not existed");
        return null;
    }
    user.procedures.push(decryptedProcedure);
    if (!await user.syncUserInformation()) {
        response.send("0")
    }
    response.send("1")
}

module.exports = addProcedure;