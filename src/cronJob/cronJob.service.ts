import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TeamService } from '../teams/teams.service';


@Injectable()
export class CronService {
  constructor(private readonly teamService: TeamService) {}

  @Cron('0 0 */1 * * *') // EVERY HOURS
  // @Cron('0 2 * * *') // EVERY DAY AT 2AM
  async generateReport() {
    await this.teamService.getTeams();
    // const teamsUpdate = await this.teamService.findAll();
    // console.log('report !!!!!!!!!!!!!', teamsUpdate.length);
  }
}
