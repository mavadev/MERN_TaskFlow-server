import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
	origin: function (origin, callback) {
		const whitelist = [process.env.FRONTEND_URL];
		console.log({ origin });
		if (!origin || whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Error de CORS'));
		}
	},
};
