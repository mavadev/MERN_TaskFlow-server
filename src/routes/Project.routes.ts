import { Router } from 'express';
import { ProjectController } from '../controllers/Project.controller';

const router = Router();

router.route('/').get(ProjectController.getAllProjects).post(ProjectController.createProject);

export default router;
