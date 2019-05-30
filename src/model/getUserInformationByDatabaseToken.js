let log = require('../log');
let config = require('../../config');

/**
 * Get User Information by database Token
 * @param db database object
 * @param token Database token
 * @returns {Promise<T>}
 */
async function getUserInformation(db,token) {
    let result = await db.collection(config.database.table).find({databaseToken:token}).toArray().catch(err => {
        log.fatal("Get User Information by database token error",err);
    });
    if (result === undefined) {
        return null;
    }
    return result;
}

module.exports = getUserInformation;