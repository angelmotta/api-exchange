import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create(createUserRequestDto: CreateUserRequestDto): Promise<AuthResponseDto> {
    // check if user with the same email already exists
    const isUserRegistred = await this.userModel.findOne({ email: createUserRequestDto.email });
    if (isUserRegistred) {
      // return HTTP 409 Conflict response
      throw new ConflictException('User with that email already exists');
    }
    
    // email requested is available, create new user
    const newUser = await this.userModel.create(createUserRequestDto);
    const savedUser = await newUser.save(); // Save the user to the database with password hashed

    // generate access token and return auth response
    const accessToken = this.generateToken(savedUser.email);
    const authUserResponse: AuthResponseDto = {
      id: savedUser.id,
      email: savedUser.email,
      accessToken,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    };

    return authUserResponse;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(loginRequestDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({ email: loginRequestDto.email });
    if (!user) {
      // return HTTP 401 Unauthorized response (User not found)
      throw new UnauthorizedException('Unauthorized access');
    }

    // check if password is correct
    const isValidPassword = await this.validatePassword(loginRequestDto.password, user.password);
    if (!isValidPassword) {
      // return HTTP 401 Unauthorized response (Incorrect password)
      throw new UnauthorizedException('Unauthorized access');
    }

    // generate access token and return auth response
    let accessToken: string;
    try {
      accessToken = this.generateToken(user.email);
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate access token');
    }

    const authUserResponse: AuthResponseDto = {
      id: user.id,
      email: user.email,
      accessToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return authUserResponse;
  }

  private async validatePassword(plainPasswordInRequest: string, hashedValidPassword: string): Promise<boolean> {
    // Hash the plain password in request and compare with the hashed password in database
    return bcrypt.compare(plainPasswordInRequest, hashedValidPassword);
  }

  private generateToken(userEmail: string): string {
    return this.jwtService.sign({ sub: userEmail });
  }
}
