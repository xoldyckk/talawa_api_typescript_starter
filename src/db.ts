import mongoose from 'mongoose';
import logger from '@talawa-api/logger';

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    });
  } catch (error) {
    logger.error('Error while connecting to mongo database', error);
    process.exit(1);
  }
};

export const disconnect = async () => {
  await mongoose.connection.close();
};

export default { connect, disconnect };
