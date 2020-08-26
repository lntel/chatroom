import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from'typeorm'
import { Field, ObjectType } from'type-graphql'
import User from './user';

// Chat table entity
Entity()
ObjectType()
export default class Chat extends BaseEntity {

    // Id field
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    // Nickname field
    @Field()
    @Column(() => User)
    username: User;

    // Content field
    @Field()
    @Column(() => String)
    content: string;

    // Timestamp field
    @Field()
    @PrimaryGeneratedColumn()
    postedDate: number;
}