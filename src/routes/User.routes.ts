import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/User.controller';
import { checkForValidationErrors, validatePasswordConfirmation } from '../middleware';

const router = Router();

router.get('/validate', UserController.validateUser);
router.get('/', UserController.getProfile);

// Perfil Público
router.post(
	'/change-profile',
	body('name').trim().notEmpty().withMessage('El nombre es requerido'),
	body('email').isEmail().withMessage('El email no es válido'),
	body('description').trim().notEmpty().withMessage('La descripción es requerida'),
	checkForValidationErrors,
	UserController.updateProfile
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
