import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.schema';
import { UserBody } from './users.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: UserBody) {
    return this.usersService.create(body);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findDetail(@Param('id') id: string): Promise<User> {
    return this.usersService.findDetail(id);
  }

  @Put(':id')
  async updateDetail(@Param('id') id: string): Promise<User> {
    return this.usersService.findDetail(id);
  }
}
