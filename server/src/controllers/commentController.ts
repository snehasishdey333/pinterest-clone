import { Request, Response, NextFunction } from "express"
import { CustomError } from "../middlewares/error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCommentsController=()=>{

}

export const postCommentsController=async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const { comment, pinId, userId } = req.body;

        // ✅ 1. Validate the Data
        if (!comment || !pinId || !userId) {
          throw new CustomError(400,"All fields are required!")
        }
    
        // ✅ 2. Check if the Pin Exists
        const pinExists = await prisma.pin.findUnique({
          where: {
            id: pinId,
          },
        });
    
        if (!pinExists) {
          throw new CustomError(404,"Pin not found!")
        }
    
        // ✅ 3. Save the Comment in Database
        const newComment = await prisma.comment.create({
          data: {
            comment: comment,
            pinId: pinId,
            userId: userId,
          },
        });
    
        // ✅ 4. Return the Response
        res.status(201).json(newComment);
    }
    catch(error){
        next(error)
    }
}