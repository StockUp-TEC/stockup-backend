import { Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { Status } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  create(createStatusInput: CreateStatusInput) {
    return 'This action adds a new status';
  }

  findAll() {
    return this.statusRepository.find();
  }

  findOne(id: number) {
    return this.statusRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.statusRepository.delete(id);
  }
}
