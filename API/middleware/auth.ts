import {Request, Response, NextFunction} from "express";
import {User} from "../types";
import {HydratedDocument} from "mongoose";
import userModel from "../models/user";

export interface RequestWithUser extends Request{
    user?: HydratedDocument<User>
}

const auth = async (req: RequestWithUser, res:Response, next:NextFunction) => {
    const tokenData = req.get('Authorization');

    if(!tokenData) {
        return res.status(400).send({error: "No token provider"})
    }

    const [_, token] = tokenData.split(' ');

    const user = await userModel.findOne({token});

    if(!user) {
        res.status(403).send({error: 'Wrong token'});
    }

    req.user = user

    next()
}

export default auth