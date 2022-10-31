import { Controller, Get, Logger } from "@nestjs/common";
import { ListOrdersDTO } from "./dto/listOrders";
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ListOrdersService } from "./listOrders.service";
import { ListOrdersServiceMicroservice } from "src/microservices/listOrders.service";


@Controller()
export class ListOrdersController {
    private logger: Logger;
    constructor(
        private readonly listOrdersServiceMicroservice: ListOrdersServiceMicroservice,
        private readonly listOrdersService: ListOrdersService){
        this.logger = new Logger(ListOrdersController.name)
    }

    @EventPattern("listOrders")
    listOrders(@Payload() data: ListOrdersDTO, @Ctx() context: RmqContext) {
        try {
            this.listOrdersService.enterOrder(data)
            this.listOrdersServiceMicroservice.ack(context)
        }
        catch(e){
            this.logger.error(e)
        }
        return
    }

    @Get()
    async getAll() {
        const orders = await this.listOrdersService.getAll()

        return orders
    }

}