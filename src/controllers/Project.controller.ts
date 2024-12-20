import type { Request, Response } from 'express';
import Project from '../models/Project.model';

export class ProjectController {
	static async createProject(req: Request, res: Response) {
		const project = new Project(req.body);
		try {
			await project.save();
			res.status(201).json(project);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getAllProjects(req: Request, res: Response) {
		try {
			const projects = await Project.find({});
			res.status(200).json(projects);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getProjectById(req: Request, res: Response) {
		try {
			const project = await Project.findById(req.params.id);
			if (!project) {
				res.status(404).json({ message: 'Proyecto no encontrado' });
				return;
			}
			res.status(200).json(project);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async updateProject(req: Request, res: Response) {
		try {
			const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
				returnDocument: 'after',
			});
			if (!project) {
				res.status(404).json({ message: 'Proyecto no encontrado' });
				return;
			}
			res.status(200).json(project);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async deleteProject(req: Request, res: Response) {
		try {
			const project = await Project.findById(req.params.id);
			if (!project) {
				res.status(404).json({ message: 'Proyecto no encontrado' });
				return;
			}
			await project.deleteOne();
			res.status(204).end();
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
