let createConnection = require('../src/model/createConnection');
let addUser = require('../src/model/addUser');
let assert = require('chai').assert;
let sampleUser = {
    id: "test",
    email: "test@test.test"
};

describe("User management",function () {

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
                let addUserResult = await addUser(mongo.db,sampleUser.id,sampleUser.email);
                assert.strictEqual(addUserResult.result.ok,1,"Insert User Error");
                done();
            }
        )();
    });

    it('Get user by ID', function () {
        (
            async function() {
                let
            }
        )();
    });
});