import { Injectable } from '@nestjs/common';
import { getNhlTeams } from './cronJob/utils/hockeyData';

@Injectable()
export class AppService {
  async getSportData(): Promise<any> {
    return await getNhlTeams();
  }
}
