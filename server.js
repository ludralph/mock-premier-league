const app = require('./app')
const dbConnection = require('./database');
const config = require('./config/config');

dbConnection();

app.listen(config.port, () => {
    console.log('App started....')
});