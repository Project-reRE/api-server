import { ModuleMetadata, Provider } from '@nestjs/common'
import { GrpcStubConfiguration } from '@client/client-grpc-stub/interface/grpc-stub-configuration.interface'
import { ClientGrpcProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { credentials } from '@grpc/grpc-js'

export interface GrpcStubModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<GrpcStubConfiguration> | GrpcStubConfiguration
  inject?: any[]
}

export const createGrpcStubClientFactory = (
  provideName: string,
  packageName: string | string[],
  protoFileName: string | string[],
) => ({
  provide: provideName,
  useFactory: (configuration: GrpcStubConfiguration): ClientGrpcProxy => {
    console.log(`GRPC_STUB_MODULE_CONFIG: ${JSON.stringify(configuration)}`)

    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: `${configuration.host}:${configuration.port}`,
        package: packageName,
        protoPath:
          protoFileName instanceof Array
            ? protoFileName.map((filename) => join(__dirname, configuration.protoPath + filename))
            : join(__dirname, configuration.protoPath + protoFileName),
        loader: {
          objects: true,
          arrays: true,
          enums: String,
          keepCase: true,
        },
        channelOptions: { 'grpc.enable_http_proxy': 0 },
        credentials: configuration.isEnabledSecureSsl ? credentials.createSsl() : credentials.createInsecure(),
      },
    })
  },
  inject: [GRPC_STUB_OPTIONS],
})

export const createGrpcStubOptionsProvider = (options: GrpcStubModuleAsyncOptions) => ({
  provide: GRPC_STUB_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject || [],
})

// export const createGrpcStubClientProviders = (options: GrpcStubModuleAsyncOptions): Provider[] => [
//   createGrpcStubClientFactory(options),
//   createGrpcStubOptionsProvider(options),
// ];

const GRPC_STUB_OPTIONS = 'GRPC_STUB_OPTIONS'
