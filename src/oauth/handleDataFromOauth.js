let User = require('../user/index');

/**
 * Handle the data from github and return a token
 * @param data
 * @returns {Promise<string>}
 */
async function forGithub(data) {
    let user = new User("github" + data.id, data.email);
    let token = await user.oauthLogin();
    return token;
}
module.exports = forGithub;