import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class ListOrdersEntity {

    @PrimaryColumn()
    public Estado: string;

    @Column()
    public Cantidad: number;

}