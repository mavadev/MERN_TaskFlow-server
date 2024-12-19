import colors from 'colors';
import server from './server';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
	connectDatabase();
	console.log(colors.cyan.bold(`Server is running on http://localhost:${PORT}`));
});
