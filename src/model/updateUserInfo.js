let log = require('../log');
let config = require('../../config');

async function updateUserInfo(db,id,update) {
    let result = await db.collection(config.database.table).updateOne({identity: id},{$set: update}).catch(err => {
        log.fatal("User information update error",err);
    });
    return result;
}

module.exports = updateUserInfo;