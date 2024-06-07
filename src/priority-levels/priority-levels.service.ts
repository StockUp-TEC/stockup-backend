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

  async findAll() {
    return this.priorityLevelRepository.find();
  }

  async findOne(id: number) {
    const status = await this.priorityLevelRepository.findOneBy({ id });
    if (!status) {
      throw new Error('Priority level not found');
    }
    return status;
  }
}
