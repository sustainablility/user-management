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


    constructor(id,email = undefined) {
        this.identity = id;
        this.email = email;
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
                        this.newToken();
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
                        this.newToken();
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

    newToken() {
        this.userToken = tokenGenerator();
        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + config.tokenLife);
        this.userTokenExpireTime = expireDate;
    }

    async renewToken() {
        this.newToken();
        let conn = await createConnection();
        let result = await this.updateUserDatabase(conn.db);
        conn.done();
        return result;
    }
    async removeUser() {
        let conn = await createConnection();
        let result = await this.removeUserByDbobject(conn.db);
        conn.done();
        return result;
    }

    async updateUserDatabase(db) {
        let update = config.newUserTemplate(this.identity,this.email,this.userToken,this.userTokenExpireTime);
        let updateResult = await updateUserInfo(db,this.identity,update);
        return updateResult.result.ok === 1;
    }

    async removeUserByDbobject(db) {
        let removeUserResult = await removeUser(db,this.identity);
        return removeUserResult.result.ok ===1;
    }

}

module.exports = User;