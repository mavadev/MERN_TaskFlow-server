import type { Request, Response } from 'express';
import Project from '../models/Project.model';
import Task from '../models/Task.model';

export class ProjectController {
	static async createProject(req: Request, res: Response) {
		try {
			await Project.create({ ...req.body, manager: req.user.id });
			res.status(201).json({ message: 'Proyecto Creado Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER - COLABORADORES */
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
	static async getProjectById(req: Request, res: Response) {
		try {
			const project = await Project.findById(req.params.projectId).populate({
				path: 'tasks',
				populate: {
					path: 'assignedTo',
					select: 'id name avatar username description',
				},
			});
			res.status(200).json({ data: project });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER */
	static async updateProject(req: Request, res: Response) {
		try {
			await Project.findByIdAndUpdate(req.project._id, req.body, { new: true });
			res.status(200).json({ message: 'Proyecto Actualizado' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async deleteProject(req: Request, res: Response) {
		try {
			// Eliminar las tareas del proyecto
			await Task.deleteMany({ project: req.project._id });

			await req.project.deleteOne();
			res.status(200).json({ message: 'Proyecto Eliminado' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
