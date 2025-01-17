import { transport } from '../config/nodemailer';

interface IEmail {
	name: string;
	email: string;
	token: string;
}

export class AuthEmail {
	static confirmAccount = async (user: IEmail) => {
		const email = await transport.sendMail({
			from: 'TaskFlow <no-reply@taskflow.com>',
			to: user.email,
			subject: 'TaskFlow -Confirma tu cuenta',
			text: 'TaskFlow -Confirma tu cuenta',
			html: `<p>Hola <b>${user.name}</b>, has creado tu cuenta en TaskFlow</p><br>
				<p>Token de Confirmación: <b>${user.token}</b></p>
				<p>Este token expira en 10 minutos.</p><br>
				<p>Para confirmar tu cuenta, ingresa el token en el siguiente enlace: <a href="#">Confirmar cuenta</a></p><br>
				<p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>`,
		});

		console.log('Mensaje enviado', email.messageId);
	};
}
