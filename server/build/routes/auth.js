"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
// import { Request } from 'express'
const router = express_1.default.Router();
router.post('/register', authController_1.registerController);
router.get('/logout', authController_1.logoutController);
exports.default = router;
