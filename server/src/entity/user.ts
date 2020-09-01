import { Entity, Column, BaseEntity, ObjectIdColumn} from 'typeorm'
import {Field, ID, ObjectType} from 'type-graphql'
import { IsEmail, Length } from 'class-validator';

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
    @Length(3, 25)
    username: string;

    //Password field
    @Column()
    @Length(6, 100)
    password: string;

    @Field()
    @Column()
    @IsEmail()
    emailAddress: string;

}