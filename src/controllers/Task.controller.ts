import type { Request, Response } from 'express';
import Task from '../models/Task.model';

export class TaskController {
	static async createTask(req: Request, res: Response) {
		try {
			// Crear tarea
			const task = new Task(req.body);
			// Asignar proyecto
			task.project = req.project.id;
			// Asignar tarea en proyecto
			req.project.tasks.push(task.id);
			// Guardar cambios
			await Promise.allSettled([task.save(), req.project.save()]);
			// Responder con tarea creada
			res.status(201).json(task);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getAllTasks(req: Request, res: Response) {
		try {
			const tasks = await Task.find({ project: req.project.id });
			res.status(200).json(tasks);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getTaskByID(req: Request, res: Response) {
		try {
			const task = await Task.findById(req.params.taskID);
			if (!task) {
				res.status(404).json({ error: 'Tarea no encontrada' });
				return;
			}
			if (task.project.toString() !== req.project.id) {
				res.status(400).json({ error: 'Tarea no pertenece al proyecto' });
				return;
			}
			res.status(200).json(task);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
