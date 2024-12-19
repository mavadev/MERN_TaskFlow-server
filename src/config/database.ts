import colors from 'colors';
import mongoose from 'mongoose';
import { exit } from 'node:process';

export const connectDatabase = async () => {
	try {
		const {
			connection: { host, port },
		} = await mongoose.connect(process.env.MONGO_URI as string);
		console.log(colors.magenta.bold(`Database connected on ${host}:${port}`));
	} catch (error) {
		console.error(colors.red.bold(`Error connecting to the database\n${error.message}`));
		exit(1);
	}
};
