import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './cronJob/cronJob.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule } from './teams/teams.module';

@Module({
  imports: [
    CronModule,
    MongooseModule.forRoot('mongodb://localhost/sportSchedule'),
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
