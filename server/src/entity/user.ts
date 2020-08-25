import { Entity, Column, BaseEntity, PrimaryGeneratedColumn} from 'typeorm'
import {Field, ObjectType} from 'type-graphql'

@Entity()
@ObjectType()
export default class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column(() => String)
    username: string;

    @Field()
    @Column(() => String)
    password: string;

}