import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schemas/team.schema';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) public teamModel: Model<Team>) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const createdTeam = new this.teamModel(createTeamDto);
    return createdTeam.save();
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  findOne(uniqueId: string) {
    console.log('uniqueId', uniqueId);
    const filter = { uniqueId: uniqueId };
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
