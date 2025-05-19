import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEVELOPMENT_ENVIRONMENTS } from './libs/common/utils/is-development-stand.utils';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEVELOPMENT_ENVIRONMENTS
		}),
		PrismaModule,
		AuthModule,
		UserModule
	],
    controllers: [],
    providers: [],
})
export class AppModule {}
