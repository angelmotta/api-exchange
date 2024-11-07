import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Controller('/api/v1.1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserRequestDto) {
    return this.usersService.create(createUserDto);
  }
}
