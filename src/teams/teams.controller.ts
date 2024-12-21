import { Controller, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { TeamService } from './teams.service';
import { TeamType } from '../utils/interface/team';
import {UpdateTeamDto} from './dto/update-team.dto'

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.TeamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.TeamService.remove(id);
  }
}
