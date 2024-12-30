import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TeamService } from './teams.service';
import { TeamType } from '../utils/interface/team';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';

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

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    this.TeamService.create(createTeamDto);
  }

  @Post('refresh')
  async refresh() {
    return this.TeamService.getTeams();
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
