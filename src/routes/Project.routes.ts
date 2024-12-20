import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';
import { ProjectController } from '../controllers/Project.controller';

const router = Router();

router
	.route('/')
	.get(ProjectController.getAllProjects)
	.post(
		body('projectName').trim().notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
		body('clientName').trim().notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
		handleValidationErrors,
		ProjectController.createProject
	);

router
	.route('/:id')
	.get(
		param('id').isMongoId().withMessage('ID no válido'), 
		handleValidationErrors, ProjectController.getProjectById
	);
	

export default router;
