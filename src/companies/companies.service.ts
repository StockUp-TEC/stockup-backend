import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createCompanyInput: CreateCompanyInput) {
    return this.companyRepository.save(createCompanyInput);
  }

  findAll() {
    return this.companyRepository.find({
      relations: {
        users: true,
      },
    });
  }

  findOne(id: number) {
    return this.companyRepository.findOne({
      where: {
        id,
      },
      relations: {
        users: true,
      },
    });
  }

  update(id: number, updateCompanyInput: UpdateCompanyInput) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  async addUserToCompany(userId: number, companyId: number) {
    await this.companyRepository
      .createQueryBuilder()
      .relation(Company, 'users')
      .of(companyId)
      .add(userId);
    return true;
  }

  async removeUserFromCompany(userId: number, companyId: number) {
    await this.companyRepository
      .createQueryBuilder()
      .relation(Company, 'users')
      .of(companyId)
      .remove(userId);
    return true;
  }

  async updateCompanyUsers(companyId: number, userIds: number[]) {
    const company = await this.companyRepository.findOneBy({ id: companyId });

    if (!company) {
      throw new Error(`Company with id ${companyId} not found`);
    }

    const users: User[] = [];
    for (const userId of userIds) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      users.push(user);
    }

    company.users = users;
    await this.companyRepository.save(company);
    return true;
  }
}
