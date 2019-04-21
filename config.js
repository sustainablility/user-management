exports.pathToOauthAuthorizationCallbackUrl = "/oauth/callback";

exports.apiURL = "http://127.0.0.1:8888";

exports.listenOnPort = 8888;

exports.oauthInfo = {
    github: {
        client_id: "5171562b9c80c6c528f0",
        client_secret: "65d6a6dfa0e91ed1c66b37536da684bde0695c31"
    }
};

exports.oauthURL = {
    github: {
        token: 'https://github.com/login/oauth/access_token',
        userInfo: "https://api.github.com/user"
    }
};

exports.database = {
    host: 'lb.thatseed.org',
    db: 'users-management',
    table: 'users-list',
    port: 6666,
};

exports.newUserTemplate = (identity = null,email = null) => {
    return {
        identity: identity,
            email: email
    };
};