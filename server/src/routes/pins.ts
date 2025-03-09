import { Router } from 'express';
import { createPinController, getPinController, getPinsController, updatePinController } from '../controllers/pinController';
import multer from "multer";
import verifyToken from '../middlewares/verifyToken';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/', getPinsController);

router.get('/:pinId',verifyToken, getPinController);

router.put('/:pinId', updatePinController);

router.post('/',verifyToken,upload.single("file") ,createPinController);

export default router;