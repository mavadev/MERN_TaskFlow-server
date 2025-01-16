export const generateToken = () =>
	Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
