import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  app: {
    port: process.env.APP_PORT,
  },
  database: {
    mongoUrl: process.env.MONGO_URL,
  },
}));
