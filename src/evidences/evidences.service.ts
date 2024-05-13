import { Injectable } from '@nestjs/common';
import { CreateEvidenceInput } from './dto/create-evidence.input';
import { Evidence } from './entities/evidence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createEvidenceInput: CreateEvidenceInput,
    authProviderId: string,
  ) {
    const { id } = await this.usersService.me(authProviderId);
    const users = await this.usersService.findByIds(
      createEvidenceInput.userIds,
    );
    const evidence = this.evidenceRepository.create({
      ...createEvidenceInput,
      createdBy: id,
      users,
    });

    return this.evidenceRepository.save(evidence);
  }

  remove(id: number) {
    return this.evidenceRepository.delete(id);
  }
}
