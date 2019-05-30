let createConnection = require('../src/model/createConnection');
let addUser = require('../src/model/addUser');
let getUserInformation = require("../src/model/getUserInformation");
let getUserInformationByToken = require('../src/model/getUserInformationByToken');
let getUserInformationByDatabaseToken = require('../src/model/getUserInformationByDatabaseToken');
let removeUser = require('../src/model/removeUser');
let updateUser = require('../src/model/updateUserInfo');
let assert = require('chai').assert;
let sampleUser = {
    identity: "test",
    email: "test@test.test",
    following: ['i','j','k'],
    organization: ['a','b'],
    personalDesc: "xxx",
    stars: ['d','e','f'],
    userToken: ['abcde'],
    userTokenExpireTime: {
        'abcde' : new Date()
    },
    databaseToken: "asdfg",
    databaseTokenExpireTime: null
};

describe("User management",function () {
    this.timeout(0);
    let mongo;
    it('Create Connection', function (done) {
        (
            async function() {
                mongo = await createConnection();
                assert.notStrictEqual(mongo,"null","Create Connection Error");
                done()
            }
        )();
    });

    it('Add user', function (done) {
        (
            async function() {
                let addUserResult = await addUser(mongo.db,sampleUser.identity,sampleUser.email);
                assert.strictEqual(addUserResult.result.ok,1,"Insert User Error");
                done();
            }
        )();
    });

    it('Update user information', function (done) {
        (
            async function() {
                let updateUserInfoResult = await updateUser(mongo.db,sampleUser.identity,sampleUser);
                assert.strictEqual(updateUserInfoResult.result.ok,1,"Update User information failed");
                done();
            }
        )();
    });

    it('Get user by ID', function (done) {
        (
            async function() {
                let userInfo = await getUserInformation(mongo.db,sampleUser.identity);
                assert.strictEqual(userInfo.length,1,"Error, because program get more than 1 users");
                assert.strictEqual(userInfo[0].identity,sampleUser.identity,"ID does not match");
                assert.strictEqual(userInfo[0].email,sampleUser.email,"Email Does not match");
                assert.strictEqual(userInfo[0].personalDesc,sampleUser.personalDesc,"Personal Description does not match");
                done();
            }
        )();
    });
    it('Get user by Token', function (done) {
        (
            async function() {
                let userInfo = await getUserInformationByToken(mongo.db,sampleUser.userToken[0]);
                assert.strictEqual(userInfo.length,1,"Error, because program get more than 1 users");
                assert.strictEqual(userInfo[0].identity,sampleUser.identity,"ID does not match");
                assert.strictEqual(userInfo[0].email,sampleUser.email,"Email Does not match");
                assert.strictEqual(userInfo[0].personalDesc,sampleUser.personalDesc,"Personal Description does not match");
                done();
            }
        )();
    });
    it('Get user by database Token', function (done) {
        (
            async function() {
                let userInfo = await getUserInformationByDatabaseToken(mongo.db,sampleUser.databaseToken);
                assert.strictEqual(userInfo.length,1,"Error, because program get more than 1 users");
                assert.strictEqual(userInfo[0].identity,sampleUser.identity,"ID does not match");
                assert.strictEqual(userInfo[0].email,sampleUser.email,"Email Does not match");
                assert.strictEqual(userInfo[0].personalDesc,sampleUser.personalDesc,"Personal Description does not match");
                done();
            }
        )();
    });
    it('Delete Testing User', function (done) {
        (
            async function() {
                let removeUserResult = await removeUser(mongo.db,sampleUser.identity);
                assert.strictEqual(removeUserResult.result.ok,1,"Remove Unsuccessful");
                assert.strictEqual(removeUserResult.result.n,1,"Remove More use than expected");
                done();
            }
        )();
    });

    it('Recheck user after deleted', function (done) {
        (
            async function() {
                let userInfo = await getUserInformation(mongo.db,sampleUser.identity);
                assert.strictEqual(userInfo.length,0,"Testing user has not deleted");
                mongo.done();
                done();
            }
        )();
    });
});