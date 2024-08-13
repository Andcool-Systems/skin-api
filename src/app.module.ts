import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinecraftController } from 'src/minecraft/minecraft.controller';
import { PrismaService } from './prisma/prisma.service';
import { MinecraftService } from './minecraft/minecraft.service';
import { AppController } from './app.controller';

ConfigModule.forRoot();

@Module({
    providers: [
        PrismaService,
        MinecraftService,
    ],
    controllers: [AppController, MinecraftController],
})
export class AppModule { }
