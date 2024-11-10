import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { UserBody } from './users.dto';
// import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(body: UserBody): Promise<User> {
    console.log(body);
    const createdUser = new this.userModel(body);
    return createdUser.save();
  }

  async findAll(): Promise<any> {
    const data = await this.userModel.find().exec();
    const res = {
      data,
      meta: {},
    };
    return res;
  }

  async findDetail(id: string): Promise<User> {
    const data = await this.userModel.findById(id).exec();
    if (!data)
      throw new NotFoundException(`id user ${id} not found in our data!`);
    return data;
  }

  async updateDetail(id: string, context: any): Promise<User> {
    await this.userModel.updateOne({ _id: id }, { $set: context });
    const data = await this.userModel.findById(id).exec();
    return data;
  }

  async deleteDetail(id: string): Promise<User> {
    const data = await this.userModel.findOneAndDelete({ _id: id }).exec();
    return data;
  }
}
