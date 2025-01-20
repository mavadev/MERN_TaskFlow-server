import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface UserPayload {
	user_id: Types.ObjectId;
}

export const generateJWT = (userPayload: UserPayload) => {
	const options = { expiresIn: '1d' };
	return jwt.sign(userPayload, process.env.JWT_SECRET, options);
};

export const decodedJWT = (jwtToken: string): UserPayload => {
	const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

	// Validar que el token contiene las propiedades necesarias
	if (typeof decoded === 'object' && 'user_id' in decoded) {
		return decoded as UserPayload;
	}

	throw new Error('Token no válido');
};
