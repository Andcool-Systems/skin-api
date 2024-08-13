import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(morgan(':method :url :status - :response-time ms'));
    await app.listen(8080);
}
bootstrap();
