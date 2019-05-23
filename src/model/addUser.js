let log = require('../log');
let config = require('../../config');

/**
 * Add user to database
 * @param db database object
 * @param id user identity
 * @param email user's email
 * @returns {Promise<T>}
 * return an raw message from mongodb
 */
async function addUser(db,id,email) {
    let result = await db.collection(config.database.table).insertOne({'identity': id,'email': email}).catch(err => {
        log.error("Add user failed",err);
        return null;
    });
    return result;
}

module.exports = addUser;