import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
	let errors = validationResult(req);
	if (errors.isEmpty()) return next();
	res.status(400).json({ errors: errors.array() });
};
