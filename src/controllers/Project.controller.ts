import type { Request, Response } from 'express';
import Project from '../models/Project.model';
import Task from '../models/Task.model';
import Note from '../models/Note.model';

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
			const selectProperties = 'clientName projectName description team';
			const [managedProjects, teamProjects] = await Promise.all([
				Project.find({ manager: req.user.id }).select(selectProperties),
				Project.find({ team: { $in: req.user.id } }).select(selectProperties),
			]);

			const projects = { managedProjects, teamProjects };
			res.status(200).json({ data: projects });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async getProjectById(req: Request, res: Response) {
		try {
			const populateTasks = {
				path: 'tasks',
				select: 'name description status assignedTo createdAt project',
				populate: {
					path: 'assignedTo',
					select: 'name avatar username',
				},
			};
			const populateTeam = {
				path: 'team',
				select: 'name avatar username',
			};
			const populateManager = {
				path: 'manager',
				select: 'name avatar username',
			};
			const project = await Project.findById(req.project._id)
				.populate(populateTasks)
				.populate(populateTeam)
				.populate(populateManager);

			// Validar que el proyecto exista
			if (!project) {
				res.status(404).json({ error: 'Proyecto no encontrado' });
				return;
			}

			res.status(200).json({ data: project });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER */
	static async updateProject(req: Request, res: Response) {
		try {
			await Project.findByIdAndUpdate(req.project._id, req.body);
			res.status(200).json({ message: 'Proyecto Actualizado' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async deleteProject(req: Request, res: Response) {
		try {
			// Obtener las tareas del proyecto
			const tasks = await Task.find({ project: req.project._id }).select('_id');
			const tasksIds = tasks.map(t => t._id);

			// Eliminar
			await Promise.allSettled([
				Note.deleteMany({ task: { $in: tasksIds } }),
				Task.deleteMany({ project: req.project._id }),
				req.project.deleteOne(),
			]);
			res.status(200).json({ message: 'Proyecto Eliminado' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async deleteAllProjects(req: Request, res: Response) {
		try {
			const projects = await Project.find({ manager: req.user.id }).select('_id');
			const tasks = await Task.find({ project: { $in: projects } }).select('_id');

			const projectIds = projects.map(p => p._id);
			const taskIds = tasks.map(t => t._id);

			await Promise.allSettled([
				Note.deleteMany({ task: { $in: taskIds } }),
				Task.deleteMany({ project: { $in: projectIds } }),
				Project.deleteMany({ manager: req.user.id }),
			]);

			res.status(200).json({ message: projectIds.length });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
