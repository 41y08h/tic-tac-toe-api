/** Configs for use in production mode */
const config = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT,
  clientURL: process.env.CLIENT_URL,
};

module.exports = config;
