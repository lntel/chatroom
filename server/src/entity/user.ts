import { Entity, Column, BaseEntity, PrimaryGeneratedColumn} from 'typeorm'
import {Field, ObjectType} from 'type-graphql'

//Users table entity
@Entity()
@ObjectType()
export default class User extends BaseEntity {

    //Id field
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    //Username field
    @Field()
    @Column(() => String)
    username: string;

    //Password field
    @Field()
    @Column(() => String)
    password: string;

}