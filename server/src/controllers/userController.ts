import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const prisma = new PrismaClient();

export const getUserController=async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const { userId } = req.params; 
    
        const pin = await prisma.user.findUnique({
          where: {
            id: userId, 
          },
          include:{
            pins:true
          }
        });
    
        res.status(200).json(pin);
      } catch (error) {
        next(error);
      }
}

export const updateUserImageController=async(req: Request, res: Response, next: NextFunction)=>{
    try{
      const file = req.file as Express.Multer.File;
      const {userId}=req.params
      
      // console.log(req.body)
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `pins/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // console.log(uploadParams)

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
    });
    const uploadResult = await new Upload({
      client: s3Client,
      params: uploadParams,
    }).done();

   
   
    const imageUrl = uploadResult.Location;

  
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        image: imageUrl as string,
      },
    });

    // Return the newly created pin
    res.status(201).json(user);
    }
    catch(error){
      console.log(error)
      next(error)
    }
}