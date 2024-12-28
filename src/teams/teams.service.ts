import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schemas/team.schema';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) public teamModel: Model<Team>) {}

  async create(teamDto: CreateTeamDto | UpdateTeamDto): Promise<Team> {
    const { _id } = teamDto;

    if (_id) {
      const existingTeam = await this.teamModel.findOne({ _id });
      if (existingTeam) {
        return this.teamModel.save({ ...existingTeam, ...teamDto });
      }
    }

    const newTeam = this.teamModel.create(teamDto);
    return await this.teamModel.save(newTeam);
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  findOne(_id: string) {
    console.log('_id', _id);
    const filter = { _id: _id };
    return this.teamModel.findOne(filter).exec();
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    const filter = { _id: id };
    return this.teamModel.updateOne(filter, updateTeamDto);
  }

  async remove(id: string) {
    const filter = { _id: id };

    const deleted = await this.teamModel.findOneAndDelete(filter).exec();
    return deleted;
  }
}
