"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pinController_1 = require("../controllers/pinController");
const router = (0, express_1.Router)();
router.get('/', pinController_1.getPinsController);
router.get('/:pinId', pinController_1.getPinController);
router.post('/', pinController_1.createPinController);
exports.default = router;
