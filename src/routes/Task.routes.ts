import { Router } from 'express';
import { body, param } from 'express-validator';
import { TaskController } from '../controllers/Task.controller';
import { validateProjectExists } from '../middleware/project';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

router
	.route('/:projectID/tasks')
	.post(
		param('projectID').isMongoId().withMessage('ID de proyecto no válido'),
		body('name').trim().notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
		handleValidationErrors,
		validateProjectExists,
		TaskController.createTask
	);

export default router;
