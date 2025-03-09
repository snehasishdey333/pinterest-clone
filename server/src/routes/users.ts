import { Router } from 'express';
import { getUserController, updateUserImageController } from '../controllers/userController';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/:userId', getUserController);

router.put('/:userId',upload.single("file"), updateUserImageController);


export default router;