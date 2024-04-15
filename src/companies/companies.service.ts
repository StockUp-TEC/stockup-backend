import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { response } from 'express';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  create(createCompanyInput: CreateCompanyInput) {
    return 'This action adds a new company';
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
}
