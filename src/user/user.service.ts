import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/__generated__';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async findById(id: string): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
			include: {
				accounts: true,
			},
		});

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введённые данные. ',
			);
		}

		return user;
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
			include: {
				accounts: true,
			},
		});

		return user as User;
	}

	async create(dto: CreateUserDto): Promise<User> {
		const { email, password, pictureUrl, displayName, isVerified, method } = dto;

		const createdUser = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				pictureUrl,
				displayName,
				isVerified,
				method,
			},
			include: {
				accounts: true,
			},
		});

		return createdUser;
	}
}
