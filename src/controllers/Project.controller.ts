import { Request, Response } from 'express';

export class ProjectController {
	static getAllProjects(req: Request, res: Response) {
		res.send('Todos los proyectos');
	}
}
