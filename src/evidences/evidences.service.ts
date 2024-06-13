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

    if (createEvidenceInput.companyIds.length === 0) {
      throw new Error('At least one company must be selected.');
    }

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
    return this.evidenceRepository.find({
      where: {
        companies: {
          workspace: {
            id: workspaceId,
          },
        },
      },
    });
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

  async remove(id: number) {
    await this.evidenceRepository.delete(id);
    return true;
  }

  async unlinkUser(evidenceId: number, userId: number) {
    const evidence = await this.evidenceRepository.findOne({
      where: { id: evidenceId },
      relations: {
        users: true,
      },
    });
    const users = evidence.users.filter((u) => u.id !== userId);
    await this.evidenceRepository.update(evidenceId, { users });
    return true;
  }
}
