import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDivision } from './entities/user-division.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Division } from '../divisions/entities/division.entity';
import { CreateUserDivisionInput } from './dto/create-user-division.input';
import { UpdateUserDivisionInput } from './dto/update-user-division.input';

@Injectable()
export class UserDivisionsService {
  constructor(
    @InjectRepository(UserDivision)
    private userDivisionRepository: Repository<UserDivision>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
  ) {}

  async validateUserAndDivision(userId: number, divisionId: number) {
    const userExists = await this.userRepository.findOneBy({ id: userId });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const divisionExists = await this.divisionRepository.findOneBy({
      id: divisionId,
    });
    if (!divisionExists) {
      throw new NotFoundException(`Division with ID ${divisionId} not found.`);
    }
  }

  async assignUserToDivision(input: CreateUserDivisionInput) {
    await this.validateUserAndDivision(input.userId, input.divisionId);
    const userDivision = await this.userDivisionRepository.findOne({
      where: { userId: input.userId, divisionId: input.divisionId },
    });

    if (userDivision) {
      throw new Error('User is already assigned to this division');
    }

    const newUserDivision = this.userDivisionRepository.create({
      userId: input.userId,
      divisionId: input.divisionId,
      isAdmin: input.isAdmin,
    });

    await this.userDivisionRepository.save(newUserDivision);
    return true;
  }

  async updateUserDivisionAdminStatus(input: UpdateUserDivisionInput) {
    await this.validateUserAndDivision(input.userId, input.divisionId);
    const userDivision = await this.userDivisionRepository.findOneOrFail({
      where: {
        userId: input.userId,
        divisionId: input.divisionId,
      },
    });

    userDivision.isAdmin = input.isAdmin;

    return this.userDivisionRepository.save(userDivision);
  }

  async removeUserFromDivision(userId: number, divisionId: number) {
    const result = await this.userDivisionRepository.delete({
      userId,
      divisionId,
    });
    if (result.affected === 0) {
      throw new Error('No record found to delete.');
    } else {
      return true;
    }
  }

  async listDivisionsForUser(userId: number) {
    return this.userDivisionRepository.find({
      where: { userId },
      relations: ['division'],
    });
  }

  async listUsersForDivision(divisionId: number) {
    // List all users associated with a division, including admin status
    return this.userDivisionRepository.find({
      where: { divisionId },
      relations: ['user'],
    });
  }
}
