export default () => ({
  env: process.env.SERVER_ENV,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE,
  },
})
