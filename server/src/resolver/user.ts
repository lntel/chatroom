import { Query, Resolver } from "type-graphql";
import User from "../entity/user";

@Resolver()
export class UserResolver {

    @Query(() => [User])
    user() {
        return User.find();
    }

}