import type { Request, Response } from 'express';
import Project from '../models/Project.model';

export class ProjectController {
	static async getProjectById(req: Request, res: Response) {
		res.status(200).json({ data: req.project });
	}

	static async getAllProjects(req: Request, res: Response) {
		try {
			const [managedProjects, teamProjects] = await Promise.all([
				Project.find({ manager: req.user.id }),
				Project.find({ team: { $in: req.user.id } }),
			]);

			const projects = { managedProjects, teamProjects };
			res.status(200).json({ data: projects });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async updateProject(req: Request, res: Response) {
		try {
			await Project.findByIdAndUpdate(req.project._id, req.body, { new: true });
			res.status(200).json({ message: 'Proyecto Actualizado' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async createProject(req: Request, res: Response) {
		try {
			await Project.create({ ...req.body, manager: req.user.id });
			res.status(201).json({ message: 'Proyecto Creado Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async deleteProject(req: Request, res: Response) {
		try {
			await req.project.deleteOne();
			res.status(204).json({ message: 'Proyecto Eliminado' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
