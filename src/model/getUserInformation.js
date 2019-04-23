let log = require('../log');
let config = require('../../config');

/**
 * Get user's information from database
 * @param db database object
 * @param identity user identity
 * @returns {Promise<null|T>}
 * return an array result from mongodb database, which is corresponding to the database.
 * If error, it would return null
 */

async function getUserInformation(db,identity) {
    let result = await db.collection(config.database.table).find({identity:identity}).toArray().catch(err => {
        log.error("Get User Information by ID error",err);
    });
    if (result === undefined) {
        return null;
    }
    return result;
}

module.exports = getUserInformation;