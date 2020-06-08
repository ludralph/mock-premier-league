const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.Promise = global.Promise;

const dbConnection = async () => {
  try{
    const db =  await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected');
    return db
  }
  catch(err){
    mongoose.connection.on('error', () => {
      throw new Error(`Unable to connect to database ${mongoUri}`)
    })
  }

}

module.exports = dbConnection;

