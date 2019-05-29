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
    getStars() {
        return this.stars;
    }
    getDatabases() {
        return this.databases;
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

    /**
     * Get User information from database
     * @param id
     * @returns {Promise<number>}
     * return 0 means okey.
     * return 1 means database connection error (on reject).
     * return 2 means user not found.
     */
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
     * @returns {Promise<string>}
     *  on resolve, the function would not return the token.
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
            conn.done();
            return Promise.reject(1);
        }
        if (userInfo.length === 0) {
            // New User
            let addUserResult = await addUser(conn.db,this.identity,this.email);
            if (addUserResult.result.ok === 1) {
                // Add user success
                this.initUser();
                let token = this.newUserToken();
                if (!this.updateUserDatabase(conn.db)){
                    // assign detail
                    conn.done();
                    return Promise.reject(3);
                }
                conn.done();
                return token;
            }else {
                conn.done();
                return Promise.reject(2);
            }
        }else {
            // Existed User
            this.transferDatabaseUserObjToThis(userInfo[0]);

            // Assign new token
            conn.done();
            return this.newUserToken();
        }
    }


    /**
     * Initialize user
     */
    initUser() {
        this.userToken = [];
        this.userTokenExpireTime = [];
        this.newDatabaseToken();
        this.stars = [];
        this.following = [];
        this.databases = [];
        this.organization = [];
        this.location = "";
        this.personalDesc = "";
    }

    /**
     * Generate a new token and return it
     * @returns {string}
     */
    newUserToken() {
        let token = tokenGenerator();
        this.userToken.push(token);
        let expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + config.userTokenLife);
        this.userTokenExpireTime[token] = expireDate;
        return token;
    }

    newDatabaseToken() {
        this.databaseToken = tokenGenerator();
        this.databaseTokenExpireTime = null;
    }

    /**
     * For checking token if expired or not existed.
     *
     * @param token
     * @returns {boolean} true if expired or not existed.
     */
    isUserTokenExpired(token) {
        if (this.userTokenExpireTime[token] === undefined) {
            // Token not existed
            return true;
        }else if (this.userTokenExpireTime[token] < new Date()) {
            // Token expired
            return true;
        }
        return false;
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