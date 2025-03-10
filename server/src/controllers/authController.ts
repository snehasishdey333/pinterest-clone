import { NextFunction, Request, Response } from "express"
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { CustomError } from "../middlewares/error";

const prisma = new PrismaClient();

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { name, username, email, password } = req.body;
      console.log(req.body)
      const existingUser = await prisma.user.findFirst({
                where: {
                  OR: [{ email }, { username }],
                },
              });
              if (existingUser) {
                throw new CustomError(500, "User already exists!")
                   }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
            data: {
              name,
              username,
              email,
              password: hashedPassword,
            },
          });
    
          const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "3d" } 
          );
      
          // Remove password from response
          const { password: _, ...userInfo } = newUser;
      
          
          res
            .cookie("token", token, { httpOnly: true,
              secure: true,    
              sameSite: 'none' })
            .status(200)
            .json(userInfo);
    }
    catch(error){
        next(error)
    }
}


export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, email, username } = req.body;

    
    if (!email && !username) {
      res.status(400).json({ message: "Email or username is required!" });
    }

    
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (!user) {
      throw new CustomError(404, "User not found!")
    }

   
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Wrong credentials!" });
    }

    if (!process.env.JWT_SECRET) {
      throw new CustomError(404, "JWT SECET not found!")
    }

   
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "3d" } 
    );

    // Remove password from response
    const { password: _, ...userInfo } = user;

    
    res
      .cookie("token", token, { httpOnly: true,
        secure: true,    
        sameSite: 'none' })
      .status(200)
      .json(userInfo);
  } catch (err) {
    next(err);
  }
};


export const logoutController=async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json("User logged out successfully!")
       
    }
    catch (error) {
        next(error)
    }
}