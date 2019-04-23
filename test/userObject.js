let User = require('../src/user/index');
let testingID = "testID";
let testingEmail = "testingEmail@test.aa";
let assert = require('chai').assert;

describe("Testing For User's Object",function () {
    it('New User', function (done) {
        (
            async function() {
                let user = await new User(testingID,testingEmail).catch(() => {
                    assert.fail("Create User Fail");
                });
                assert.strictEqual(testingID,user.getID(),"New user ID does not match the expected value");
                assert.strictEqual(testingEmail,user.getEmail(),"New user Email does not match the expected value");
                done();
            }
        )();
    });
    it('Login with test User', function () {

    });
});