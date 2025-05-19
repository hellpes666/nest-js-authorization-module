import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '@prisma/__generated__';
import { type Response, type Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	async register(req: Request, dto: RegisterDto) {
		const isUserExists = await this.userService.findByEmail(dto.email);

		if (isUserExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.',
			);
		}

		const newUser = await this.userService.create({
			email: dto.email,
			password: dto.password,
			displayName: dto.name,
			pictureUrl: '',
			isVerified: false,
			method: AuthMethod.CREDENTIALS,
		});

		return this.saveSession(req, newUser);
	}

	async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email);

		if (!user || !user.password) {
			throw new NotFoundException(
				'пользователь не найден. Пожалуйста, проверьте корректность данных.',
			);
		}

		const isValidPassword = await verify(user.password, dto.password);

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Невверный пароль. Пожалуйста, попробуйте ещё раз или воссстановите пароль, если забыли его.',
			);
		}

		return this.saveSession(req, user);
	}

	logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.',
						),
					);
				}

				res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

				resolve();
			});
		});
	}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id;

			req.session.save((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сесссию. Проверьте, правильность настройки параметров сессии.',
						),
					);
				}

				resolve({
					user,
				});
			});
		});
	}
}
