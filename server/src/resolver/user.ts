import { compareSync, hashSync } from "bcrypt";
import { IsEmail, Length } from "class-validator";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "vm";
import config from "../config";
import User from "../entity/user";

@InputType()
class createUserInput {

    @Field()
    @Length(3, 25)
    username: string;

    @Field()
    @Length(6, 100)
    password: string;

    @Field()
    @IsEmail()
    emailAddress: string;

}

@InputType()
class loginUserInput {

    @Field()
    @Length(3, 25)
    username: string;

    @Field()
    @Length(6, 100)
    password: string;

}

@Resolver()
export class UserResolver {

    @Query(() => [User])
    user() {
        return User.find();
    }

    @Query(() => User)
    me() {
        
    }

    @Mutation(() => User)
    async createUser(
        @Arg('options') options: createUserInput
    ) {

        const userObject = {
            username: options.username.toLowerCase(),
            emailAddress: options.emailAddress.toLowerCase(),
            password: options.password
        };

        const usernameExists = await User.findOne({
            where: {
                username: userObject.username
            }
        });

        if(usernameExists) {
            return new Error('This username is already in use');
        }

        const emailExists = await User.findOne({
            where: {
                emailAddress: userObject.emailAddress
            }
        });

        if(emailExists) {
            return new Error('This email is already in use');
        }

        userObject.password = hashSync(userObject.password, 12)

        const user = await User.create(userObject).save()

        return user;
    }

    @Mutation(() => Boolean)
    async userSignIn(
        @Arg('options') options: loginUserInput,
        @Ctx() { req, res }: { req: Request, res: Response }
    ) {

        console.log(res)

        const user = await User.findOne({
            where: {
                username: options.username.toLowerCase()
            }
        });

        if(!user) return new Error('This username could not be found');

        if(!compareSync(options.password, user.password)) {
            return new Error('Incorrect credentials, please try again');
        }

        const refreshToken = sign({
            userId: user.id
        }, config.accessTokenSecret, {
            expiresIn: '7d'
        });

        const accessToken = sign({
            userId: user.id
        }, config.accessTokenSecret, {
            expiresIn: '15min'
        });

        const refreshTokenExpiryDate = new Date(new Date().getTime()+(7*24*60*60*1000));
        const accessTokenExpiryDate = new Date(new Date().getTime()+( 60 * 60 * 15 * 1000 ));

        res.cookie('refresh-token', refreshToken, { expires: refreshTokenExpiryDate })
        res.cookie('access-token', accessToken, { expires: accessTokenExpiryDate })

        return true;
    }


}