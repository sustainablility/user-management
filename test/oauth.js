let assert = require('chai').assert;
let readline = require('readline');
let config = require('../config');
let getToken = require('../src/oauth/getToken');
let getUserInfoByToken = require('../src/oauth/getUserInfoByToken');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

describe("Oauth Testing",function () {
    describe("Github oauth testing",function () {
        let code;
        let token;
        it('Get oauth code', function (done) {
            this.timeout(0);
            code = rl.question("Input Code from Github: https://github.com/login/oauth/authorize?client_id=" + config.oauthInfo.github.client_id + "&scope=user:email",function (result) {
                code = result;
                rl.close();
                done();
            })
        });
        it('Get Token', function (done) {
            (
                async function() {
                    token = await getToken(code,config.oauthURL.github.token,config.oauthInfo.github.client_id,config.oauthInfo.github.client_secret);
                    assert.notStrictEqual(token,null,"Get Token Error");
                    done()
                }
            )();
        });
        it('Get User Information', function (done) {
            (
                async function() {
                    let userInfo = await getUserInfoByToken(token,config.oauthURL.github.userInfo);
                    assert.notStrictEqual(userInfo,null,"Get User Info Error; token does not works");
                    done();
                }
            )()
        });
    })
});