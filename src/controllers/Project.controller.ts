import { Request, Response } from 'express';
import Project from '../models/Project.model';

export class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);
		try {
			await project.save();
			res.status(201).json(project);
		} catch (error) {
			console.error(error);
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({});
			res.status(200).json(projects);
		} catch (error) {
			console.error(error);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		try {
			const project = await Project.findById(req.params.id);
			if (!project) {
				res.status(404).json({ error: 'Proyecto no encontrado' });
				return;
			}
			res.status(200).json(project);
		} catch (error) {
			console.error(error);
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		try {
			const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
				returnDocument: 'after',
			});
			if (!project) {
				res.status(404).json({ error: 'Proyecto no encontrado' });
				return;
			}
			res.status(200).json(project);
		} catch (error) {
			console.error(error);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		try {
			const project = await Project.findById(req.params.id);
			if (!project) {
				res.status(404).json({ error: 'Proyecto no encontrado' });
				return;
			}
			await project.deleteOne();
			res.status(204).end();
		} catch (error) {
			console.error(error);
		}
	};
}
