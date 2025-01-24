import { Router } from 'express';
import { body, param } from 'express-validator';

import { checkForValidationErrors, checkManagerValidity } from '../middleware';
import { TeamController } from '../controllers/TeamController';

const router = Router();

router.get('/', TeamController.getTeam);

router.post(
	'/add',
	body('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	checkManagerValidity,
	TeamController.addMember
);

router.delete(
	'/delete/:userId',
	param('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	checkManagerValidity,
	TeamController.removeMember
);

router.post(
	'/search',
	body('username').isString().notEmpty().withMessage('El nombre de usuario es obligatorio'),
	checkForValidationErrors,
	checkManagerValidity,
	TeamController.getUsersByUsername
);

export default router;
