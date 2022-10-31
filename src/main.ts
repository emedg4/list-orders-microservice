import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ListOrdersServiceMicroservice } from './microservices/listOrders.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService)

  const listOrdersService = app.get<ListOrdersServiceMicroservice>(ListOrdersServiceMicroservice);
  app.connectMicroservice(listOrdersService.getOptions(configService.get("rbmq.list_orders_queue")))

  app.startAllMicroservices()
  await app.listen(configService.get('app.port'));
}
bootstrap();
