import { Router } from 'express';
import { body } from 'express-validator';
import { NoteController } from '../controllers/Note.controller';
import { checkForValidationErrors } from '../middleware';

const router = Router();

router
	.route('/')
	.post(
		body('content').trim().notEmpty().withMessage('El Contenido de la Nota es Obligatorio'),
		checkForValidationErrors,
		NoteController.createNote
	);
export default router;
