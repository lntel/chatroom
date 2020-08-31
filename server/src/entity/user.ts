import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ObjectIdColumn} from 'typeorm'
import {Field, ID, ObjectType} from 'type-graphql'
import { isEmail } from 'class-validator';

//Users table entity
@ObjectType()
@Entity()
export default class User extends BaseEntity {

    //Id field
    @Field(() => ID)
    @ObjectIdColumn()
    id: string ;

    //Username field
    @Field()
    @Column()
    username: string;

    //Password field
    @Column()
    password: string;

    @Field()
    @Column()
    emailAddress: string;

}