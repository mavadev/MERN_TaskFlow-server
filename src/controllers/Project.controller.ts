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
}
