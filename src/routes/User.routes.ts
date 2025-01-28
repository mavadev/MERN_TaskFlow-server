import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/User.controller';
import { checkForValidationErrors } from '../middleware';

const router = Router();

const validatePasswordConfirmation = (value, { req }) => {
	if (value !== req.body.password) {
		throw new Error('Las contraseñas no coinciden');
	}
	return true;
};
router.get('/', UserController.getUser);

router.get('/validate', UserController.validateUser);

router.post(
	'/change-password',
	body('current_password').trim().notEmpty().withMessage('La actual contraseña es obligatoria'),
	body('password').isLength({ min: 8 }).withMessage('El password debe ser de mínimo 8 caracteres'),
	body('password_confirmation')
		.notEmpty()
		.withMessage('La confirmación del password es requerida')
		.custom(validatePasswordConfirmation),
	checkForValidationErrors,
	UserController.changePassword
);
export default router;
