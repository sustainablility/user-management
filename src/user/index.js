let addUser = require('../model/addUser');
let createConnection = require('../model/createConnection');
let getUserInfo = require('../model/getUserInformation');
let removeUser = require('../model/removeUser');

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


    constructor(id,email = null) {
        return new Promise(async (resolve, reject) => {
            let conn = await createConnection();
            let userInfo = await getUserInfo(conn.db,id);
            if (userInfo !== null) {
                // If no error in database
                if (userInfo.length === 0) {
                    // New user
                    let addUserResult = await addUser(conn.db,id,email);
                    if (addUserResult.result.ok === 1) {
                        this.identity = id;
                        this.email = email;
                        this.userToken = tokenGenerator();
                        let expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 30);
                        this.userTokenExpireTime = expireDate;
                        conn.done();
                        resolve(this);
                    }else {
                        conn.done();
                        reject();
                    }
                }else {
                    // User existed
                    this.identity = userInfo[0].identity;
                    this.email = userInfo[0].email;
                    conn.done();
                    resolve(this);
                }
            }
        })
    }


}

module.exports = User;