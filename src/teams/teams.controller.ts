import { Controller, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { TeamService } from './teams.service';
import { TeamType } from '../utils/interface/team';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly TeamService: TeamService) {}

  @Get()
  async findAll(): Promise<TeamType[]> {
    return this.TeamService.findAll();
  }

  @Get(':uniqueId')
  findOne(@Param('uniqueId') uniqueId: string) {
    return this.TeamService.findOne(uniqueId);
  }

  @Patch(':uniqueId')
  update(
    @Param('uniqueId') uniqueId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.TeamService.update(uniqueId, updateTeamDto);
  }

  @Delete(':uniqueId')
  remove(@Param('uniqueId') uniqueId: string) {
    return this.TeamService.remove(uniqueId);
  }
}
