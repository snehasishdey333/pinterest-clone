import { Router } from 'express';
import { getCommentsController, postCommentsController } from '../controllers/commentController';
import verifyToken from '../middlewares/verifyToken';


const router = Router();


router.get('/:postId',verifyToken, getCommentsController);

router.post('/',verifyToken, postCommentsController);



export default router;