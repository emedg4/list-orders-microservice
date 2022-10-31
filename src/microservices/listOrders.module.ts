import { DynamicModule, Module } from '@nestjs/common';
import { ListOrdersServiceMicroservice } from './listOrders.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [ListOrdersServiceMicroservice],
  exports: [ListOrdersServiceMicroservice]
})
export class ListOrdersModuleMicroservice {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: ListOrdersModuleMicroservice,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.list_orders_queue')
              },
            }),
            inject: [ConfigService]
          }
        ])
      ],
      exports: [ClientsModule]
    }
  }
}
