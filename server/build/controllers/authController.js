"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.loginController = exports.registerController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// export const registerController = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { name, username, email, password } = req.body;
//     const existingUser = await prisma.user.findFirst({
//         where: {
//           OR: [{ email }, { username }],
//         },
//       });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         username,
//         email,
//         password: hashedPassword,
//       },
//     });
//     res.status(201).json(newUser);
//   } catch (err) {
//     next(err);
//   }
// };
const registerController = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;
        res.status(201).json("hi");
    }
    catch (error) {
        next(error);
    }
};
exports.registerController = registerController;
const loginController = async (req, res, next) => {
    try {
        const { password, email, username } = req.body;
        if (!email && !username) {
            return res.status(400).json({ message: "Email or username is required!" });
        }
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong credentials!" });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables!");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "3d" });
        // Remove password from response
        const { password: _, ...userInfo } = user;
        res
            .cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
            .status(200)
            .json(userInfo);
    }
    catch (err) {
        next(err);
    }
};
exports.loginController = loginController;
const logoutController = async (req, res, next) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json("User logged out successfully!");
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
