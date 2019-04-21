let app = require('express')();
let config = require('./config');

function service(){
    app.get(config.pathToOauthAuthorizationCallbackUrl, require('./src/oauth/index'));
    app.listen(config.listenOnPort);
}

service();
