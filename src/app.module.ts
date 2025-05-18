import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEVELOPMENT_ENVIRONMENTS } from './libs/common/utils/is-development-stand.utils';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEVELOPMENT_ENVIRONMENTS
		})
	],
    controllers: [],
    providers: [],
})
export class AppModule {}
