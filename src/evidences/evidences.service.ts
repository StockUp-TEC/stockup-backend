import { Injectable } from '@nestjs/common';
import { CreateEvidenceInput } from './dto/create-evidence.input';
import { Evidence } from './entities/evidence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    createEvidenceInput: CreateEvidenceInput,
    authProviderId: string,
  ) {
    const { id } = await this.usersService.me(authProviderId);
    const users = await this.usersService.findByIds(
      createEvidenceInput.userIds,
    );
    const companies = await this.companiesService.findByIds(
      createEvidenceInput.companyIds,
    );
    const evidence = this.evidenceRepository.create({
      ...createEvidenceInput,
      createdBy: id,
      users,
      companies,
    });

    return this.evidenceRepository.save(evidence);
  }

  findForWorkspace(workspaceId: number) {
    return this.evidenceRepository
      .createQueryBuilder('evidence')
      .innerJoin('evidence.companies', 'company')
      .innerJoin('company.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId })
      .getMany();
  }

  findForCompany(companyId: number) {
    return this.evidenceRepository.find({
      where: {
        companies: {
          id: companyId,
        },
      },
    });
  }

  remove(id: number) {
    return this.evidenceRepository.delete(id);
  }
}
