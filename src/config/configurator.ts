export const Configurator = () => ({
  app: {
    port: process.env.APP_PORT,
  },
  database: {
    mongoUrl: process.env.DATABASE_MONGO_URL,
  },
});
