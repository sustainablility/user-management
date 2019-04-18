let app = require('express')();
let config = require('./config');

app.get(config.pathToOauthAuthorizationCallbackUrl, require('./src/oauth/index').default);

app.listen(8888);