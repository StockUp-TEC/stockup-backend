import { Injectable } from '@nestjs/common';
import { PriorityLevel } from './entities/priority-level.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PriorityLevelsService {
  constructor(
    @InjectRepository(PriorityLevel)
    private priorityLevelRepository: Repository<PriorityLevel>,
  ) {}

  findOne(id: number) {
    return this.priorityLevelRepository.findOneBy({ id });
  }
}
