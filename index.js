let app = require('express')();
let config = require('./config');
let cors = require('cors');
function service(){
    app.use(cors());
    app.get(config.pathToOauthAuthorizationCallbackUrl, require('./src/oauth/index'));
    app.get("/backend/oauthLoginReturnOauthToken", require('./src/apis/oauthLoginReturnOauthToken'));
    app.get("/backend/addProcedure", require('./src/apis/addProcedure'));
    app.get("/user/info",require('./src/apis/getUserInformationByToken'));
    app.get("/backend/getIdByDatabaseToken",require('./src/apis/getUserIDByDatabaseToken'));
    app.get("/fontend/userinfo",require("./src/apis/getPublicUserInformationByToken"));
    app.listen(config.listenOnPort);
}

service();
