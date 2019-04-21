let mongoClient = require('mongodb').MongoClient;
let databaseConfig = require('../../config').database;
let log = require('../log');

/**
 * Function for creating an database connection
 * @returns {Promise<{done: done, db: Db}|null>}
 * return.db is Database Object, and return.done() is the function for closing the database
 */
async function connectToUserDatabase() {
    let dbUrl = "mongodb://" + databaseConfig.host + ":" + databaseConfig.port + '/';
    let dbs = await mongoClient.connect(dbUrl,{ useNewUrlParser: true }).catch(error => {
        log.fatal("Cannot Connect to database",error);
    });
    if (dbs === undefined) {
        return null;
    } else {
        let done = () => {
            dbs.close();
        };
        let db = dbs.db(databaseConfig.db);
        return {
            db: db,
            done: done
        };
    }
}


module.exports = connectToUserDatabase;