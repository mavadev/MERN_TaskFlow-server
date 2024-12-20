import type { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project.model';

declare global {
	namespace Express {
		interface Request {
			project: IProject;
		}
	}
}

export const validateProjectExists = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { projectID } = req.params;

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
