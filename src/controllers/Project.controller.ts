import type { Request, Response } from 'express';
import Project from '../models/Project.model';

export class ProjectController {
	static async createProject(req: Request, res: Response) {
		try {
			const project = await Project.create({ ...req.body, manager: req.user.id });
			res.status(201).json({ message: 'Proyecto Creado Correctamente', data: project });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getAllProjects(req: Request, res: Response) {
		try {
			const projects = await Project.find({ manager: req.user.id });
			res.status(200).json({ message: 'Proyectos Encontrados', data: projects });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getProjectById(req: Request, res: Response) {
		res.status(200).json({ message: 'Proyecto Encontrado', data: req.project });
	}

	static async updateProject(req: Request, res: Response) {
		try {
			const updatedProject = await Project.findByIdAndUpdate(req.project._id, req.body, { new: true });
			res.status(200).json({ message: 'Proyecto Actualizado', data: updatedProject });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async deleteProject(req: Request, res: Response) {
		try {
			await req.project.deleteOne();
			res.status(204).json({ message: 'Proyecto Eliminado', data: null });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
