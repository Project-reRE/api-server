export default () => ({
  env: process.env.NODE_ENV || 'local',
  port: parseInt(process.env.PORT, 10) || 3000,
  protoPath: process.env.GRPC_PROTO_PATH || '../../../grpc-idl/proto/',
  grpc: {
    user: {
      host: process.env.GRPC_USER_HOST || '127.0.0.1',
      port: process.env.GRPC_USER_PORT || '30004',
    },
  },
})
