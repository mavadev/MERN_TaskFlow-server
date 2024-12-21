import type { Request, Response, NextFunction } from 'express';
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

export const validateProjectExists = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { projectID } = req.params;
		if (!isValidObjectId(projectID)) {
			res.status(400).json({ error: 'El ID del Proyecto no es válido.' });
			return;
		}

		const project = await Project.findById(projectID);
		if (!project) {
			res.status(404).json({ message: 'Proyecto no encontrado' });
			return;
		}
		req.project = project;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const validateTaskExists = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { taskID } = req.params;
		if (!isValidObjectId(taskID)) {
			res.status(400).json({ error: 'El ID de la Tarea no es válido.' });
			return;
		}

		const task = await Task.findOne({ _id: taskID, project: req.project.id });
		if (!task) {
			res.status(404).json({ message: 'Tarea no encontrada' });
			return;
		}
		req.task = task;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
