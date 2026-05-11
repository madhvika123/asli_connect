const mongoose = require('mongoose');
const logger = require('../utils/logger');

// connectDb function
const connectDb = async () => {
  try {
    const url = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database Connection Error', error);
  }
}

// export
module.exports = connectDb;