import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/User.controller';
import { checkForValidationErrors, validatePasswordConfirmation } from '../middleware';

const router = Router();

router.get('/validate', UserController.validateUser);
router.post(
	'/check-password',
	body('password').trim().notEmpty().withMessage('La contraseña es requerida'),
	checkForValidationErrors,
	UserController.checkPassword
);
// Perfil Público
router.route('/').get(UserController.getProfile).delete(UserController.deleteProfile).patch(
	body('name').trim().notEmpty().withMessage('El nombre es requerido'),
	body('email').isEmail().withMessage('El email no es válido'),

	body('description').trim().notEmpty().withMessage('La descripción es requerida'),
	checkForValidationErrors,
	UserController.updateProfile
);
router.patch(
	'/collaboration',
	body('collaborate').isBoolean().withMessage('El valor debe ser booleano'),
	body('collaborators').isBoolean().withMessage('El valor debe ser booleano'),
	checkForValidationErrors,
	UserController.updateContribution
);

// Account
router.patch(
	'/username',
	body('username').trim().notEmpty().withMessage('El nombre de usuario es requerido'),
	checkForValidationErrors,
	UserController.updateUsername
);

// Autenticación
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
