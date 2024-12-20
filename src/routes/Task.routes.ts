import { Router } from 'express';
import { body, param } from 'express-validator';
import { TaskController } from '../controllers/Task.controller';
import { validateProjectExists } from '../middleware/project';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

router.param('projectID', validateProjectExists);

router
	.route('/:projectID/tasks')
	.post(
		body('name').trim().notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
		handleValidationErrors,
		TaskController.createTask
	)
	.get(TaskController.getAllTasks);

router
	.route('/:projectID/tasks/:taskID')
	.get(
		param('taskID').isMongoId().withMessage('El ID de la Tarea no es válido'),
		handleValidationErrors,
		TaskController.getTaskByID
	);

export default router;
