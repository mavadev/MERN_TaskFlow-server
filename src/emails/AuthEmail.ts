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
            <p>Para confirmar tu cuenta, por favor ingresa al siguiente enlace:
              <a href="#">Confirmar cuenta</a></p>
            <p>Este enlace expira en 10 minutos.</p><br>
            <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>`,
		});

		console.log('Mensaje enviado', email.messageId);
	};
}
