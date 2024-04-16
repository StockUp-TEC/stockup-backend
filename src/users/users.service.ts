import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserInput) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(first?: number) {
    return await this.userRepository.find({
      take: first,
      relations: ['workspaces'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['workspaces'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async me(authId: string) {
    const user = await this.userRepository.findOne({
      where: { authProviderId: authId },
      relations: ['workspaces'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserInput) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
