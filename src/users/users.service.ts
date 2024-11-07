import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(createUserRequestDto: CreateUserRequestDto) {
    // check if user with the same email already exists
    const isUserRegistred = await this.userModel.findOne({ email: createUserRequestDto.email });
    if (isUserRegistred) {
      // return HTTP 409 Conflict response
      throw new ConflictException('User with that email already exists');
    }
    
    // email requested is available, create new user
    const newUser = await this.userModel.create(createUserRequestDto);
    const savedUser = await newUser.save(); // Save the user to the database with password hashed
    return savedUser.toJSON();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
