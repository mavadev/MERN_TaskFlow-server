import { Router } from 'express';
import { body } from 'express-validator';
import { TaskController } from '../controllers/Task.controller';
import { checkForValidationErrors, checkTaskValidity } from '../middleware';

const router = Router();

router.param('taskId', checkTaskValidity);

router
	.route('/')
	.post(
		body('name').trim().notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
		checkForValidationErrors,
		TaskController.createTask
	)
	.get(TaskController.getAllTasks);

router
	.route('/:taskId')
	.get(TaskController.getTaskByID)
	.put(
		body('name').trim().notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
		body('status').trim().notEmpty().withMessage('El Estado de la Tarea es Obligatoria'),
		checkForValidationErrors,
		TaskController.updateTask
	)
	.delete(TaskController.deleteTask);

router.patch(
	'/:taskId/status',
	body('status').trim().notEmpty().withMessage('El Estado de la Tarea es Obligatoria'),
	checkForValidationErrors,
	TaskController.updateTaskStatus
);

export default router;
