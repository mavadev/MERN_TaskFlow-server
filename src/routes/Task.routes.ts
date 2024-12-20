import { Router } from 'express';
import { TaskController } from '../controllers/Task.controller';

const router = Router();

router.route('/').get(TaskController.getTasks);

export default router;
