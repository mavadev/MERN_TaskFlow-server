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

	static async getAllProjects(_: Request, res: Response) {
		try {
			const projects = await Project.find({});
			res.status(200).json(projects);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getProjectById(req: Request, res: Response) {
		res.status(200).json(req.project);
	}

	static async updateProject(req: Request, res: Response) {
		try {
			const projectUpdated = await req.project.updateOne(req.body, { returnDocument: 'after' });
			res.status(200).json(projectUpdated);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async deleteProject(req: Request, res: Response) {
		try {
			await req.project.deleteOne();
			res.status(204).end();
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
