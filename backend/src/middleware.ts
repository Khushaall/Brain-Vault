import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
const JWT_SECRET="Secret!23"
import dotenv from "dotenv";
dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction): void => {

    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({
            message:"No Token"
        });
        return;
    }


    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        //@ts-ignore
        req.userId = decoded.id;
        next();
    
}
    catch(err){
        res.status(401).json({
            message:"Wrong Token"
        })
        return;
    }
}