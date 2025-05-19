import 'express-session';

declare module 'express-sesion' {
	interface SessionData {
		userId?: string;
	}
}
