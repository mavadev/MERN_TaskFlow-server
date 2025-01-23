import { Router } from 'express';
import { body, param } from 'express-validator';

import { checkForValidationErrors } from '../middleware';
import { TeamController } from '../controllers/TeamController';

const router = Router();

router.post(
	'/addMember',
	body('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	TeamController.addMember
);

router.get('/', TeamController.getTeam);

router.delete(
	'/:userId',
	param('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	TeamController.removeMember
);

router.post(
	'/search',
	body('username').isString().notEmpty().withMessage('El nombre de usuario es obligatorio'),
	checkForValidationErrors,
	TeamController.getUsersByUsername
);

export default router;
