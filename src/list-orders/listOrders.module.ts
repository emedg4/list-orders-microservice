import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListOrdersEntity } from "./entities/listOrders";
import { ListOrdersModuleMicroservice } from '../microservices/listOrders.module';
import { LIST_ORDERS } from "./constants/services";
import { ListOrdersController } from "./listOrders.controller";
import { ListOrdersService } from "./listOrders.service";

@Module({
    imports: [ TypeOrmModule.forFeature([ ListOrdersEntity ]),
    ListOrdersModuleMicroservice.register({
                    name: LIST_ORDERS
                }),],
    controllers: [ ListOrdersController ],
    providers: [ ListOrdersService ]
})
export class ListOrdersModule {}