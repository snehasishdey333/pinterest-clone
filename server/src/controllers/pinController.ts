import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express"
import { CustomError } from "../middlewares/error";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

export const getPinsController=async(req: Request, res: Response, next: NextFunction)=>{
   try{
    console.log("hi")
      const { search } = req.query; 

      let pins;
      if (search) {
       
        pins = await prisma.pin.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: search as string,
                  mode: "insensitive", 
                },
              },
              {
                description: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            ],
          },
        });
      } else {
       
        pins = await prisma.pin.findMany();
      }
    
    res.status(200).json(pins);
}
   catch(error){
    next(error)
   }
}


export const getPinController = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const { pinId } = req.params; 
 
     
     const pin = await prisma.pin.findUnique({
       where: {
         id: pinId, 
       },
       include:{
         user:true,
         comments:true
       }
     });
 
     res.status(200).json(pin);
   } catch (error) {
     next(error);
   }
 };

export const createPinController=async(req: Request, res: Response, next: NextFunction)=>{
    try{
      const file = req.file as Express.Multer.File;
      console.log(file)
      const {
        title,description,userId,link
      } = req.body;
      
      console.log(req.body)
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `pins/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    console.log(uploadParams)

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      // credentials: {
      //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      // }
    });
    const uploadResult = await new Upload({
      client: s3Client,
      params: uploadParams,
    }).done();

   
   
    const imageUrl = uploadResult.Location;
  console.log(imageUrl)
  
    const pin = await prisma.pin.create({
      data: {
        title,
        description,
        userId,
        link:link || "",
        image: imageUrl as string,
      },
    });

    console.log(pin)

    // Return the newly created pin
    res.status(201).json(pin);
    }
    catch(error){
      console.log(error)
      next(error)
    }
}

export const updatePinController=async(req: Request, res: Response, next: NextFunction)=>{
   try {
      const { pinId } = req.params;
      const { title, description, image, userId } = req.body;
  
      // Check if the pin exists
      const existingPin = await prisma.pin.findUnique({
        where: {
          id: pinId,
        },
      });
  
      if (!existingPin) {
        throw new CustomError(404,"pin not found!")
      }
  
      // Update the pin
      const updatedPin = await prisma.pin.update({
        where: {
          id: pinId,
        },
        data: {
          title: title || existingPin?.title,
          description: description || existingPin?.description,
          image: image || existingPin?.image,
          userId: userId || existingPin?.userId
        },
      });
  
      res.status(200).json(updatedPin);
  
    } catch (error) {
      next(error);
    }
}