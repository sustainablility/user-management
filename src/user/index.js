let addUser = require('../model/addUser');
let createConnection = require('../model/createConnection');
let getUserInfo = require('../model/getUserInformation');
let removeUser = require('../model/removeUser');
let updateUserInfo = require('../model/updateUserInfo');
let getUserInfoByToken = require('../model/getUserInformationByToken');
let getUserInfoByDatabaseToken = require('../model/getUserInformationByDatabaseToken');

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
    getProcedures() {
        return this.procedures;
    }
    getTools() {
        return this.tools;
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

    /**
     * Packing user data
     * @returns {{databases: Array, following: Array, organization: Array, databaseTokenTimeRemain: number, location: string, id: undefined, stars: Array, personalDesc: string, email: undefined, databaseToken: *}}
     */
    packingUserInformation() {
        let now = new Date();
        let databaseToken;
        let databaseTokenTimeRemain;
        if ((this.databaseTokenExpireTime === null || this.databaseTokenExpireTime > now) && this.databaseToken !== null) {
            databaseToken = this.databaseToken;
            if (this.databaseTokenExpireTime === null) {
                databaseTokenTimeRemain = null;
            }else {
                databaseTokenTimeRemain = this.databaseTokenExpireTime - now;
            }
        }else {
            databaseToken = null;
            databaseTokenTimeRemain = null;
        }
        return {
            id: this.identity,
            email: this.email,
            following: this.following,
            stars: this.stars,
            databases: this.databases,
            procedures: this.procedures,
            tools: this.tools,
            organization: this.organization,
            location: this.location,
            personalDesc: this.personalDesc,
            databaseToken: databaseToken,
            databaseTokenTimeRemain: databaseTokenTimeRemain
        };
    }


    constructor(id = undefined,email = undefined) {
        this.identity = id;
        this.email = email;
    }

    /**
     * Get User from database by id to this
     * @returns {Promise<number>}
     * return 0 means okey.
     * return 1 means database connection error.
     * return 2 means user not found.
     */
    async getUserById() {
        let conn = await createConnection();
        let userInfo = await getUserInfo(conn.db,this.identity);
        if (userInfo == null) {
            // Database Connection Error
            conn.done();
            return 1;
        }
        if (userInfo.length === 0) {
            // User not found
            conn.done();
            return 2;
        }
        this.transferDatabaseUserObjToThis(userInfo[0]);
        conn.done();
        return 0;
    }

    /**
     * Get user from database by token to this
     * @param userToken
     * @returns {Promise<number>}
     * return 0 means okey.
     * return 1 means database connection error.
     * return 2 means user not found.
     */
    async getUserByToken(userToken) {
        let conn = await createConnection();
        let userInfo = await getUserInfoByToken(conn.db,userToken);
        if (userInfo == null) {
            // Database Connection Error
            conn.done();
            return 1;
        }
        if (userInfo.length === 0) {
            // User not found
            conn.done();
            return 2;
        }
        this.transferDatabaseUserObjToThis(userInfo[0]);
        if (!this.userTokenExpireTime.hasOwnProperty(userToken)) {
            // User Token Expire time not existed
            this.userToken.splice(this.userToken.indexOf(userToken),1);
            this.updateUserDatabase(conn.db);
            conn.done();
            return 2;
        }
        if (this.userTokenExpireTime[userToken] < new Date()) {
            // User Token Expire time not existed
            this.userToken.splice(this.userToken.indexOf(userToken),1);
            delete this.userTokenExpireTime[userToken];
            this.updateUserDatabase(conn.db);
            conn.done();
            return 2;
        }
        this.transferDatabaseUserObjToThis(userInfo[0]);
        conn.done();
        return 0;
    }

    /**
     * Get user from database by database token to this
     * @param databaseToken
     * @returns {Promise<number>}
     * return 0 means okey.
     * return 1 means database connection error.
     * return 2 means user not found.
     */
    async getUserByDatabaseToken(databaseToken) {
        let conn = await createConnection();
        let userInfo = await getUserInfoByDatabaseToken(conn.db,databaseToken);
        conn.done();
        if (userInfo == null) {
            // Database Connection Error
            return 1;
        }
        if (userInfo.length === 0) {
            // User not found
            return 2;
        }
        if (userInfo[0].databaseTokenExpireTime !== null) {
            if (userInfo[0].databaseTokenExpireTime < new Date()) {
                // Token Expired
                return 2;
            }
        }
        this.transferDatabaseUserObjToThis(userInfo[0]);
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
                    // assign token failed
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
            let userToken = this.newUserToken();
            if (!this.updateUserDatabase(conn.db)){
                // assign token failed
                conn.done();
                return Promise.reject(3);
            }
            // Assign success
            conn.done();
            return userToken;
        }
    }


    /**
     * Initialize user
     */
    initUser() {
        this.userToken = [];
        this.userTokenExpireTime = {};
        this.newDatabaseToken();
        this.stars = [];
        this.following = [];
        this.databases = [];
        this.procedures = [];
        this.tools = [];
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