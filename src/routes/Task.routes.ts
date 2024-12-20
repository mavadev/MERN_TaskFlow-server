import { Router } from 'express';
import { TaskController } from '../controllers/Task.controller';
import { validateProjectExists } from '../middleware/project';

const router = Router();

router.route('/:projectID/tasks')
	.post(validateProjectExists, TaskController.createTask);

export default router;
