let log = require('../log');
let config = require('../../config');

async function addUser(db,id,email) {
    let result = await db.collection(config.database.table).insertOne(config.newUserTemplate(id,email)).catch(err => {
        log.error("Add user failed",err);
        return null;
    });
    return result;
}

module.exports = addUser;