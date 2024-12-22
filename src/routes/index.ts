import { Router } from 'express';
import taskRoutes from './Task.routes';
import projectRoutes from './Project.routes';
import { checkProjectValidity } from '../middleware';

const router = Router();

// Validaciones por param (projectId)
router.param('projectId', checkProjectValidity);

// Rutas
router.use('/projects', projectRoutes);
router.use('/projects/:projectId/tasks', taskRoutes);

export default router;
