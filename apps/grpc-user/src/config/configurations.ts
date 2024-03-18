export default () => ({
  env: process.env.NODE_ENV || 'local',
  grpcPort: process.env.GRPC_USER_PORT || '30004',
  protoPath: process.env.GRPC_PROTO_PATH || '../../../grpc-idl/proto/',
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || parseInt(process.env.MYSQL_USER_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME || process.env.MYSQL_USER_DB_NAME || process.env.DB_NAME_TEST,
    timezone: process.env.DB_TIMEZONE || 'Z',
    slave: {
      host: process.env.DB_SLAVE_HOST || process.env.DB_HOST,
      port:
        parseInt(process.env.DB_SLAVE_PORT, 10) ||
        parseInt(process.env.DB_PORT, 10) ||
        parseInt(process.env.MYSQL_USER_PORT, 10) ||
        3306,
      user: process.env.DB_SLAVE_USER || process.env.DB_USER,
      password: process.env.DB_SLAVE_PASSWORD || process.env.DB_PASSWORD || '',
      name:
        process.env.DB_SLAVE_NAME || process.env.DB_NAME || process.env.MYSQL_USER_DB_NAME || process.env.DB_NAME_TEST,
      timezone: process.env.DB_TIMEZONE || 'Z',
    },
    config: {
      connectionLimit: parseInt(process.env.connectionLimit) || 5,
      maxIdle: parseInt(process.env.maxIdle) || 5,
      idleTimeout: parseInt(process.env.idleTimeout) || 7210000,
    },
  },
  grpc: {},
})
