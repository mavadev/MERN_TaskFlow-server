import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
	origin: function (origin, callback) {
		const whitelist = [process.env.FRONTEND_URL];
		if (process.env.NODE_ENV === 'development' || whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Acceso denegado a la API'));
		}
	},
};
