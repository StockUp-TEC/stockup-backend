import { Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';

@Injectable()
export class StatusesService {
  create(createStatusInput: CreateStatusInput) {
    return 'This action adds a new status';
  }

  findAll() {
    return `This action returns all statuses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateStatusInput: UpdateStatusInput) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
