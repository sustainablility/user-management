let log = require('../log');
let config = require('../../config');

/**
 * Remove user
 * @param db database object
 * @param id identity
 * @returns {Promise<T>}
 * return an raw message from mongodb
 */
async function removeUser(db,id) {
    let result = await db.collection(config.database.table).deleteOne({identity:id}).catch(err => {
        log.fatal("Remove User error",err);
    });
    return result;
}

module.exports = removeUser;