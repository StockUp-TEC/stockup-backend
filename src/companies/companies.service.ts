import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  findByIds(ids: number[]) {
    return this.companyRepository.findBy({ id: In(ids) });
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

  async update(updateCompanyInput: UpdateCompanyInput) {
    const { id, ...input } = updateCompanyInput;
    const result = await this.companyRepository.update(id, input);
    if (result.affected === 0) {
      throw new Error(`Company with id ${id} not found`);
    }
    return await this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Company with id ${id} not found`);
    }
    return true;
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
