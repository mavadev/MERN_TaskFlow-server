import { Router } from 'express';
import { body } from 'express-validator';
import { ProjectController } from '../controllers/Project.controller';
import { checkForValidationErrors, checkProjectValidity } from '../middleware';

const router = Router();

router.param('projectId', checkProjectValidity);

router
	.route('/')
	.get(ProjectController.getAllProjects)
	.post(
		body('projectName').trim().notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
		body('clientName').trim().notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
		checkForValidationErrors,
		ProjectController.createProject
	);

router
	.route('/:projectId')
	.get(ProjectController.getProjectById)
	.put(
		body('projectName').trim().notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
		body('clientName').trim().notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
		body('description').trim().notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
		checkForValidationErrors,
		ProjectController.updateProject
	)
	.delete(ProjectController.deleteProject);

export default router;
