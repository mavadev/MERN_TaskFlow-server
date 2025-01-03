import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';

import Task, { ITask } from '../models/Task.model';
import Project, { IProject } from '../models/Project.model';

declare global {
	namespace Express {
		interface Request {
			project: IProject;
			task: ITask;
		}
	}
}

export const checkProjectValidity = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validar ID del proyecto
		const { projectId } = req.params;
		if (!isValidObjectId(projectId)) {
			res.status(400).json({ error: 'El ID del Proyecto no es válido.' });
			return;
		}

		// Validar que el proyecto exista
		const project = await Project.findById(projectId).populate('tasks');
		if (!project) {
			res.status(404).json({ error: 'Proyecto no encontrado' });
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
		const task = await Task.findOne({ _id: taskId, project: req.project.id });
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
