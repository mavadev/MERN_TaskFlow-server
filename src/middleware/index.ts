import type { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';

import { decodedJWT } from '../utils/jwt';
import User, { IUser } from '../models/User.model';
import Task, { ITask } from '../models/Task.model';
import Project, { IProject } from '../models/Project.model';

declare global {
	namespace Express {
		interface Request {
			project: IProject;
			task: ITask;
			user: IUser;
			preUser: IUser;
		}
	}
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const bearerToken = req.headers.authorization;

	if (!bearerToken) {
		res.status(401).json({ error: 'No autorizado' });
		return;
	}

	const [, token] = bearerToken?.split(' ');
	console.log({ bearerToken, token });
	try {
		// Decodificar token
		const decodedToken = decodedJWT(token);

		// Buscar usuario
		const user = await User.findById(decodedToken.user_id).select('name avatar username password');

		if (!user) {
			res.status(401).json({ error: 'Token no válido' });
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const checkManagerValidity = (req: Request, res: Response, next: NextFunction) => {
	if (req.user.id !== req.project.manager.toString()) {
		res.status(401).json({ error: 'Acción no permitida' });
		return;
	}
	next();
};

export const checkEmailValidity = async (req: Request, res: Response, next: NextFunction) => {
	// Validar email
	check('email').isEmail().withMessage('Email no válido')(req, res, errors => {
		if (errors) return res.status(400).json({ errors: errors.array() });
	});

	// Buscar usuario
	const user = await User.findOne({ email: req.body.email });

	req.preUser = user;
	next();
};

export const checkProjectValidity = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validar ID del proyecto
		const { projectId } = req.params;
		if (!isValidObjectId(projectId)) {
			res.status(400).json({ error: 'El ID del Proyecto no es válido.' });
			return;
		}

		// Validar que el proyecto exista
		const project = await Project.findById(projectId).select('manager team tasks');
		if (!project) {
			res.status(404).json({ error: 'Proyecto no encontrado' });
			return;
		}

		// Validar que el proyecto pertenezca al usuario o que sea colaborador
		if (project.manager.toString() !== req.user.id && !project.team.includes(req.user.id)) {
			res.status(401).json({ error: 'Acción no permitida' });
			return;
		}

		// Asignar proyecto al request
		req.project = project;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const checkTaskValidity = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validar ID de la tarea
		const { taskId } = req.params;
		if (!isValidObjectId(taskId)) {
			res.status(400).json({ error: 'El ID de la Tarea no es válido.' });
			return;
		}

		// Validar que la tarea exista
		const task = await Task.findOne({ _id: taskId, project: req.project.id }).select('notes');
		if (!task) {
			res.status(404).json({ error: 'Tarea no encontrada' });
			return;
		}

		// Asignar tarea al request
		req.task = task;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const checkForValidationErrors = (req: Request, res: Response, next: NextFunction) => {
	let errors = validationResult(req);
	if (errors.isEmpty()) return next();
	res.status(400).json({ errors: errors.array() });
};

export const validatePasswordConfirmation = (value, { req }) => {
	if (value !== req.body.password) {
		throw new Error('Las contraseñas no coinciden');
	}
	return true;
};
