import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('/api/v1.1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserRequestDto): Promise<AuthResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.usersService.login(loginRequestDto);
  }
}
