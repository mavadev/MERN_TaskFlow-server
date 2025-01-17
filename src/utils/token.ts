import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
dotenv.config({ path: '.env' });

export const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString();

export interface IHashedToken {
	user_id: string | JwtPayload;
	token: string | JwtPayload;
}

export const generateHashedToken = (contentToken: IHashedToken) => {
	const payload = { user_id: contentToken.user_id, token: contentToken.token };
	const options = { expiresIn: '10m' };

	return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const decodedHashedToken = (token: string): IHashedToken => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// Validar que el token contiene las propiedades necesarias
	if (typeof decoded === 'object' && 'user_id' in decoded && 'token' in decoded) {
		return decoded as IHashedToken;
	}

	throw new Error('El token no tiene la estructura esperada');
};
