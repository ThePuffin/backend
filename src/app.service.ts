import { Injectable } from '@nestjs/common';
import { HockeyData } from './cronJob/utils/hockeyData';

@Injectable()
export class AppService {
  async getSportData(): Promise<any> {
    const hockeyData = new HockeyData();
    return await hockeyData.getNhlTeams();
  }
}
