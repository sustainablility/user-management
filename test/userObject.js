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
                temp.token = userToken;
                done();
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
                done()
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
});