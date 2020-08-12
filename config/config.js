require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'development';

CONFIG.port = process.env.PORT || '3200';

CONFIG.db_uri  = process.env.MONGODB_URI   || 'mongodb://username:password@mlab.com:27017/db';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';

CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '28800';

module.exports = CONFIG;
