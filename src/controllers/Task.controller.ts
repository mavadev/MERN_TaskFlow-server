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
}
