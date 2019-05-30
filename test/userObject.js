let User = require('../src/user/index');
let testingID = "testID";
let testingEmail = "testingEmail@test.aa";
let assert = require('chai').assert;
let temp = {};

describe("Testing For User's Object",function () {
    it('New User', function (done) {
        (
            async function() {
                let user = new User(testingID,testingEmail);
                let userToken = await user.oauthLogin().catch((err) => {
                    switch (err) {
                        case 1:
                            assert.fail("user existed, but token assign error");
                            break;
                        case 2:
                            assert.fail("new user, but adding user failed");
                            break;
                        case 3:
                            assert.fail("new user, but assigning user token failed");
                            break;
                    }
                });
                assert.strictEqual(testingID,user.getID(),"New user ID does not match the expected value");
                assert.strictEqual(testingEmail,user.getEmail(),"New user Email does not match the expected value");
                assert.notStrictEqual(userToken,null,"Token Generate failed");
                assert.notStrictEqual(userToken,undefined,"Token Generate failed");
                if (!user.userTokenExpireTime.hasOwnProperty(userToken)) {
                    assert.fail("User Token expire time does not created");
                }
                temp.token = userToken;
                temp.databaseToken = user.databaseToken;
                setTimeout(function () {
                    done();
                },100);
            }
        )();
    });
    it('Login with test User', function (done) {
        (
            async function() {
                let user = new User(testingID,testingEmail);
                let newUserToken = await user.oauthLogin().catch(err => {
                    switch (err) {
                        case 1:
                            assert.fail("user existed, but token assign error");
                            break;
                        case 2:
                            assert.fail("new user, but adding user failed");
                            break;
                        case 3:
                            assert.fail("new user, but assigning user token failed");
                            break;
                    }
                });
                assert.strictEqual(temp.token,user.userToken[0],"Token suppose to be same");
                assert.strictEqual(newUserToken,user.userToken[1],"Token suppose to be same");
                temp.newToken = newUserToken;
                if (!user.userTokenExpireTime.hasOwnProperty(user.userToken[0])) {
                    assert.fail("User Token expire time lost");
                }
                if (!user.userTokenExpireTime.hasOwnProperty(user.userToken[1])) {
                    assert.fail("User Token expire time lost");
                }
                if (user.userTokenExpireTime[newUserToken] <= user.userTokenExpireTime[temp.token]) {
                    assert.fail("Token Timeout wrong")
                }
                done()
            }
        )();
    });
    it('Get user by ID', function (done) {
        (
            async function() {
                let user = new User(testingID,testingEmail);
                let result = await user.getUserById();
                assert.strictEqual(result,0,"Get User by ID failed");
                done();
            }
        )();
    });
    it('Get user by Token', function (done) {
        (
            async function() {
                let user = new User();
                let result = await user.getUserByToken(temp.token);
                assert.strictEqual(result,0,"Get User by Token failed");
                done();
            }
        )();
    });
    it('Token Expire test', function (done) {
        (
            async function() {
                // New user
                let user = new User();
                await user.getUserByToken(temp.token);

                // Set expire date backward
                user.userTokenExpireTime[temp.token].setDate(user.userTokenExpireTime[temp.token].getDate() - 1);
                let conn = await require('../src/model/createConnection')();
                user.updateUserDatabase(conn.db);

                // Test that user with expired token
                let expireUser = new User();
                let result = await expireUser.getUserByToken(temp.token);
                assert.strictEqual(result,2,"User Does not expired");

                // Test that user with non-expired token
                let nonExpireUser = new User();
                let anotherResult = await nonExpireUser.getUserByToken(temp.newToken);
                assert.strictEqual(anotherResult,0,"User expired");
                
                // Check if expired token deleted (Should be deleted)
                assert.strictEqual(nonExpireUser.userToken.indexOf(temp.token),-1,"Expired token does not deleted");
                if (nonExpireUser.userTokenExpireTime.hasOwnProperty(temp.token)) {
                    assert.fail("Expired token time does not deleted");
                }
                conn.done();
                done();
            }
        )();
    });
    it('Get user by database token', function (done) {
        (
            async function() {
                let user = new User();
                let result = await user.getUserByDatabaseToken(temp.databaseToken);
                assert.strictEqual(result,0,"Get User by database Token failed");
                done();
            }
        )();
    });
    it('Packing User information', function (done) {
        (
            async function() {
                let user = new User(testingID,testingEmail);
                await user.oauthLogin().catch(err => {
                    switch (err) {
                        case 1:
                            assert.fail("user existed, but token assign error");
                            break;
                        case 2:
                            assert.fail("new user, but adding user failed");
                            break;
                        case 3:
                            assert.fail("new user, but assigning user token failed");
                            break;
                    }
                });
                let expireTime = new Date();
                expireTime.setDate(expireTime.getDate() + 1);
                user.databaseTokenExpireTime = expireTime;
                let packedInformation = user.packingUserInformation();
                assert.equal(packedInformation.databaseTokenTimeRemain,86400000,"Token expire time wrong");
                done();
            }
        )();
    });
    it('Remove User', function (done) {
        (
            async function() {
                let user = new User(testingID,testingEmail);
                await user.oauthLogin().catch(err => {
                    switch (err) {
                        case 1:
                            assert.fail("user existed, but token assign error");
                            break;
                        case 2:
                            assert.fail("new user, but adding user failed");
                            break;
                        case 3:
                            assert.fail("new user, but assigning user token failed");
                            break;
                    }
                });
                if (!await user.removeUser()) {
                    assert.fail("Remove User Failed");
                }
                done();
            }
        )();
    });
    it('Recheck user by ID', function (done) {
        (
            async function() {
                let user = new User(testingID,testingEmail);
                let result = await user.getUserById();
                assert.strictEqual(result,2,"Recheck user by ID failed");
                done();
            }
        )();
    });
    it('Recheck user by Token', function (done) {
        (
            async function() {
                let user = new User();
                let result = await user.getUserByToken(temp.token);
                assert.strictEqual(result,2,"Recheck user by Token failed");
                done();
            }
        )();
    });
});