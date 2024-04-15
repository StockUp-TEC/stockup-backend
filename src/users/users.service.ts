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

  async findAll() {
    return await this.userRepository.find({ relations: ['workspaces'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['workspaces'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    // // For each workspace, only keep the division that the user is in
    // user.workspaces.forEach((workspace) => {
    //   workspace.divisions = workspace.divisions.filter((division) => {
    //     console.log(division.name);
    //     console.log(division.userDivisions);
    //     if (!division.userDivisions) {
    //       return false;
    //     }
    //
    //     const userDivision = division.userDivisions.find(
    //       (userDivision) => userDivision.user.id === id,
    //     );
    //     if (userDivision) {
    //       division.userDivisions = [userDivision];
    //       return true;
    //     }
    //     return false;
    //   });
    // });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserInput) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
