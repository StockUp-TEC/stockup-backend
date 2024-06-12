import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDivision } from './entities/user-division.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Division } from '../divisions/entities/division.entity';
import { CreateUserDivisionInput } from './dto/create-user-division.input';

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

  async validateUsersAndDivision(userIds: number[], divisionId: number) {
    for (const userId of userIds) {
      const userExists = await this.userRepository.findOneBy({ id: userId });
      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
    }

    const divisionExists = await this.divisionRepository.findOneBy({
      id: divisionId,
    });
    if (!divisionExists) {
      throw new NotFoundException(`Division with ID ${divisionId} not found.`);
    }
  }

  async validateUserBelongsToDivision(userId: number, divisionId: number) {
    const userDivision = await this.userDivisionRepository.findOneBy({
      userId,
      divisionId,
    });
    if (!userDivision) {
      throw new NotFoundException(
        `User with ID ${userId} does not belong to division with ID ${divisionId}.`,
      );
    }
  }

  async addUsersToDivision(input: CreateUserDivisionInput) {
    await this.validateUsersAndDivision(
      input.userData.map((u) => u.userId),
      input.divisionId,
    );

    const userDivisions: UserDivision[] = [];
    for (const user of input.userData) {
      const newUserDivision = this.userDivisionRepository.create({
        userId: user.userId,
        divisionId: input.divisionId,
        isAdmin: user.isAdmin,
      });
      userDivisions.push(newUserDivision);
    }

    return this.userDivisionRepository.save(userDivisions);
  }

  async setDivisionUsers(input: CreateUserDivisionInput) {
    await this.validateUsersAndDivision(
      input.userData.map((u) => u.userId),
      input.divisionId,
    );

    await this.userDivisionRepository.delete({ divisionId: input.divisionId });

    const userDivisions: UserDivision[] = [];
    for (const user of input.userData) {
      const newUserDivision = this.userDivisionRepository.create({
        userId: user.userId,
        divisionId: input.divisionId,
        isAdmin: user.isAdmin,
      });
      userDivisions.push(newUserDivision);
    }

    await this.userDivisionRepository.save(userDivisions);
    return true;
  }

  // async updateUserDivisionAdminStatus(input: UpdateUserDivisionInput) {
  //   await this.validateUserAndDivision(input.userId, input.divisionId);
  //   const userDivision = await this.userDivisionRepository.findOneOrFail({
  //     where: {
  //       userId: input.userId,
  //       divisionId: input.divisionId,
  //     },
  //   });
  //
  //   userDivision.isAdmin = input.isAdmin;
  //
  //   return this.userDivisionRepository.save(userDivision);
  // }
  //
  // async removeUserFromDivision(userId: number, divisionId: number) {
  //   const result = await this.userDivisionRepository.delete({
  //     userId,
  //     divisionId,
  //   });
  //   if (result.affected === 0) {
  //     throw new Error('No record found to delete.');
  //   } else {
  //     return true;
  //   }
  // }

  async deleteAllUsersForDivision(divisionId: number) {
    const result = await this.userDivisionRepository.delete({ divisionId });
    return result.affected > 0;
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

  async removeUserFromDivision(userId: number, divisionId: number) {
    const result = await this.userDivisionRepository.delete({
      userId,
      divisionId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `User with ID ${userId} not found in division with ID ${divisionId}.`,
      );
    }
    return true;
  }
}
