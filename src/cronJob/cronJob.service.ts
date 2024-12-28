import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HockeyData } from './utils/hockeyData';

@Injectable()
export class CronService {
  @Cron('0 2 * * *') // EVERY DAY AT 2AM
  generateReport() {
    console.log('report !!!!!!!!!!!!!');
    const hockeyData = new HockeyData()
    hockeyData.getNhlTeams();
  }
}
