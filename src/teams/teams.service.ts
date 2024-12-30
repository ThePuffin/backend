import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schemas/team.schema';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { HockeyData } from '../cronJob/utils/hockeyData';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) public teamModel: Model<Team>) {}

  async create(teamDto: CreateTeamDto | UpdateTeamDto): Promise<Team> {
    const { uniqueId } = teamDto;

    if (uniqueId) {
      console.log({ uniqueId });

      const existingTeam = await this.findOne(uniqueId);

      console.log({ existingTeam });

      if (existingTeam) {
        Object.assign(existingTeam, teamDto);
        return await existingTeam.save();
      }
    }

    const newTeam = new this.teamModel(teamDto);
    return await newTeam.save();
  }

  async getSportData(): Promise<any> {
    const hockeyData = new HockeyData();
    const activeTeams = await hockeyData.getNhlTeams();
    for (const activeTeam of activeTeams) {
      const newTeam = new this.teamModel(activeTeam);
      const save = await newTeam.save();
      console.log({ save });
    }

    return activeTeams;
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async findOne(uniqueId: string) {
    console.log('uniqueId', uniqueId);
    const filter = { uniqueId: uniqueId };
    const team = await this.teamModel.findOne(filter).exec();
    console.log({ team });

    return team;
  }

  update(uniqueId: string, updateTeamDto: UpdateTeamDto) {
    const filter = { uniqueId: uniqueId };
    return this.teamModel.updateOne(filter, updateTeamDto);
  }

  async remove(uniqueId: string) {
    const filter = { uniqueId: uniqueId };

    const deleted = await this.teamModel.findOneAndDelete(filter).exec();
    return deleted;
  }
}
