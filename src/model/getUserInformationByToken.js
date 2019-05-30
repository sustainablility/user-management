let log = require('../log');
let config = require('../../config');

/**
 * Get User Information by Token
 * @param db database object
 * @param token User token
 * @returns {Promise<T>}
 */
async function getUserInformation(db,token) {
    let result = await db.collection(config.database.table).find({userToken:token}).toArray().catch(err => {
        log.fatal("Get User Information by Token error",err);
    });
    if (result === undefined) {
        return null;
    }
    return result;
}

module.exports = getUserInformation;