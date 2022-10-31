import { Inject, Injectable, Logger } from "@nestjs/common";
import { ListOrdersDTO } from "./dto/listOrders";
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from "@nestjs/microservices";
import { LIST_ORDERS } from "./constants/services";
import { ListOrdersEntity } from './entities/listOrders';
import { Repository } from 'typeorm';
import { TODOS } from "./constants/estados";


@Injectable()
export class ListOrdersService {
    private logger: Logger;
    constructor(
        @Inject( LIST_ORDERS ) private listOrdersClient: ClientProxy,
        @InjectRepository(ListOrdersEntity) private listOrdersRepository: Repository<ListOrdersEntity>
    ){
        this.logger = new Logger(ListOrdersService.name);
        this.initDB();
    }
    async enterOrder(data: ListOrdersDTO){
        const aumento_decremento_stock: number = 1;

        if (data.previo != null){
            this.listOrdersRepository.increment({ Estado: data.actual }, "Cantidad", aumento_decremento_stock)
            this.listOrdersRepository.decrement({ Estado: data.previo }, "Cantidad", aumento_decremento_stock)
            this.logger.log(`Se aumenta stock en ${data.actual} estado y se decrementa en ${data.previo}.`)
        }
        else{
            this.listOrdersRepository.increment({ Estado: data.actual }, "Cantidad", aumento_decremento_stock)
            this.listOrdersRepository.increment({ Estado: TODOS }, "Cantidad", aumento_decremento_stock)
            this.logger.log(`Se aumenta stock en ${data.actual}.`)
        }
    }

    async getAll(){

        const orders =  await this.listOrdersRepository.find()
        this.logger.log(JSON.stringify(orders), "Information returned")

        return orders
    }

    private async initDB() {
        const isDBInitialized = await this.listOrdersRepository.find();

        if(isDBInitialized.length == 0){
            const listOrders:Array<ListOrdersEntity> = [
            {Estado: "Todos", Cantidad:0},
            {Estado: "Ingresados", Cantidad:0},
            {Estado: "SinPagar", Cantidad:0},
            {Estado: "EnPreparacion", Cantidad:0},
            {Estado: "EnDespacho", Cantidad:0},
            {Estado: "Finalizados", Cantidad:0}
            ]
            const DBInitialized = this.listOrdersRepository.save(listOrders)
            this.logger.log((DBInitialized), "Database Initialized with values")

        }
        return
    }
    

}