let app = require('express')();
let config = require('./config');

function service(){
    app.get(config.pathToOauthAuthorizationCallbackUrl, require('./src/oauth/index'));
    app.get(config.pathToGetUserInformationByToken,require('./src/apis/getUserInformationByToken'));
    app.get(config.pathToGetIDByDatabaseToken,require('./src/apis/getUserIDByDatabaseToken'));
    app.listen(config.listenOnPort);
}

service();
