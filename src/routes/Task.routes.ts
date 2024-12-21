import { Router } from 'express';
import { body, param } from 'express-validator';
import { TaskController } from '../controllers/Task.controller';
import { handleValidationErrors } from '../middleware/validation';
import { validateProjectExists, validateTaskExists } from '../middleware/task';

const router = Router();

router.param('projectID', validateProjectExists);
router.param('taskID', validateTaskExists);

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
	)
	.put(
		param('taskID').isMongoId().withMessage('El ID de la Tarea no es válido'),
		body('name').trim().notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
		body('status').trim().notEmpty().withMessage('El Estado de la Tarea es Obligatoria'),
		handleValidationErrors,
		TaskController.updateTask
	)
	.delete(
		param('taskID').isMongoId().withMessage('El ID de la Tarea no es válido'),
		handleValidationErrors,
		TaskController.deleteTask
	)
	.patch(
		param('taskID').isMongoId().withMessage('El ID de la Tarea no es válido'),
		body('status').trim().notEmpty().withMessage('El Estado de la Tarea es Obligatoria'),
		handleValidationErrors
	);

router.patch(
	'/:projectID/tasks/:taskID/status',
	param('taskID').isMongoId().withMessage('El ID de la Tarea no es válido'),
	body('status').trim().notEmpty().withMessage('El Estado de la Tarea es Obligatoria'),
	handleValidationErrors,
	TaskController.updateTaskStatus
);

export default router;
