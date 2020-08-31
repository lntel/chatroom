import { Mutation, Query, Resolver } from "type-graphql";
import User from "../entity/user";

@Resolver()
export class UserResolver {

    @Query(() => [User])
    user() {
        return User.find();
    }

    @Mutation(() => User)
    async createUser() {
        const user = await User.create({
            username: 'test',
            password: 'testing',
            emailAddress: 'test@gmail.com'
        }).save()

        return user;
    }


}