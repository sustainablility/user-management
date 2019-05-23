let addUser = require('../model/addUser');
let createConnection = require('../model/createConnection');
let getUserInfo = require('../model/getUserInformation');
let removeUser = require('../model/removeUser');
let updateUserInfo = require('../model/updateUserInfo');

let config = require('../../config');
let tokenGenerator = require('./tokenGenerator');
class User {

    getID() {
        return this.identity
    }
    getEmail() {
        return this.email
    }
    getUserToken() {
        return this.userToken;
    }
    getUserTokenExpireTime() {
        return this.userTokenExpireTime;
    }
    getDatabaseToken() {
        return this.databaseToken;
    }
    getDatabaseTokenExpireTime() {
        return this.databaseTokenExpireTime;
    }
    getFollowing() {
        return this.following;
    }
    getDatabases() {
        return this.databases;
    }
    getStars() {
        return this.stars;
    }
    getOrganization() {
        return this.organization;
    }
    getLocation() {
        return this.location;
    }
    getPersonalDesc() {
        return this.personalDesc
    }


    constructor(id,email = undefined) {
        this.identity = id;
        this.email = email;
    }

    async getUser(id) {
        let conn = await createConnection();
        let userInfo = await getUserInfo(conn.db,this.identity);
        if (userInfo == null) {
            // Database Connection Error
            return Promise.reject(1);
        }
        if (userInfo.length === 0) {
            // User not found
            return Promise.reject(2);
        }
        this.transferDatabaseUserObjToThis(userInfo[0]);
        conn.done();
        return 0;
    }

    transferDatabaseUserObjToThis(userInfo) {
        for (let key in userInfo) {
            this[key] = userInfo[key];
        }
    }

    transferThisToDatabaseUserObj() {
        let newObj = {};
        for (let key in this) {
            newObj[key] = this[key];
        }
        return newObj;
    }

    /**
     * For the action after we get the oauth massage.
     * If ID is new, it would create a new user and generate a new token.
     * If ID existed and token expired, it would generate a new token.
     *
     * @returns {Promise<any>}
     *  on resolve, the function would not return anything.
     *
     *  on reject, the function would return following things:
     *  1 means user existed, but token assign error.
     *  2 means new user, but adding user failed.
     *  3 means new user, but assigning user token failed
     */
    async oauthLogin() {
        let conn = await createConnection();
        let userInfo = await getUserInfo(conn.db,this.identity);
        if (userInfo == null) {
            // Database Error
            return Promise.reject(1);
        }
        if (userInfo.length === 0) {
            // New User
            let addUserResult = await addUser(conn.db,this.identity,this.email);
            if (addUserResult.result.ok === 1) {
                // Add user success
                this.newUserToken()
            }
        }
    }

    newUserInitialize() {
        this.newUserToken();
        this.newDatabaseToken();
    }
    login() {
        return new Promise(async (resolve, reject) => {
            let conn = await createConnection();
            let userInfo = await getUserInfo(conn.db,this.identity);
            if (userInfo !== null) {
                // If no error in database
                if (userInfo.length === 0) {
                    // New user
                    let addUserResult = await addUser(conn.db,this.identity,this.email);
                    if (addUserResult.result.ok === 1) {
                        // If adding user success, assign the token
                        this.newUserToken();
                        if (await this.updateUserDatabase(conn.db)) {
                            // Assign token success
                            conn.done();
                            resolve(this);
                        }else {
                            // Assign token failed
                            conn.done();
                            reject(3);
                        }
                    }else {
                        // Adding user failed
                        conn.done();
                        reject(2);
                    }
                }else {
                    // User existed
                    this.email = userInfo[0].email;
                    if (new Date() > userInfo[0].userTokenExpireTime) {
                        // Token expired
                        this.newUserToken();
                        if (await this.updateUserDatabase(conn.db)) {
                            // assign token success
                            conn.done();
                            resolve(this);
                        } else {
                            // assign token failed
                            conn.done();
                            reject(1);
                        }
                    }else {
                        // Token does not expired
                        this.userToken = userInfo[0].userToken;
                        this.userTokenExpireTime = userInfo[0].userTokenExpireTime;
                        conn.done();
                        resolve(this);
                    }

                }
            }
        })
    }

    /**
     * Generate a new user token in this object.
     */
    newUserToken() {
        this.userToken = tokenGenerator();
        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + config.tokenLife);
        this.userTokenExpireTime = expireDate;
    }

    newDatabaseToken() {
        this.databaseToken = tokenGenerator();
        this.databaseTokenExpireTime = null;
    }

    /**
     * New user token and sync to database
     * @returns {Promise<*>}
     */
    async renewUserToken() {
        this.newUserToken();
        let conn = await createConnection();
        let result = await this.updateUserDatabase(conn.db);
        conn.done();
        return result;
    }

    /**
     * Remove this user.
     * @returns {Promise<*>}
     */
    async removeUser() {
        let conn = await createConnection();
        let result = await this.removeUserByDbobject(conn.db);
        conn.done();
        return result;
    }

    /**
     * Sync everything in this object to database.
     * @param db
     * @returns {Promise<boolean>}
     */
    async updateUserDatabase(db) {
        // Remember: If you add any variables in this object, you have to change this:
        let update = this.transferThisToDatabaseUserObj();
        let updateResult = await updateUserInfo(db,this.identity,update);
        return updateResult.result.ok === 1;
    }

    /**
     * Helper function for removeUser
     * @param db
     * @returns {Promise<boolean>}
     */
    async removeUserByDbobject(db) {
        let removeUserResult = await removeUser(db,this.identity);
        return removeUserResult.result.ok ===1;
    }

}

module.exports = User;