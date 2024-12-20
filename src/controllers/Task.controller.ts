import type { Request, Response } from 'express';

export class TaskController {
	static async getTasks(req: Request, res: Response) {
		const { projectID } = req.params;
		console.log(projectID);
	}
}
