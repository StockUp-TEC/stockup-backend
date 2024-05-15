import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBackgroundInput } from './dto/create-background.input';
import { UpdateBackgroundInput } from './dto/update-background.input';
import { Background } from './entities/background.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BackgroundsService {
  constructor(
    @InjectRepository(Background)
    private backgroundRepository: Repository<Background>,
  ) {}

  async findOne(id: number) {
    const background = await this.backgroundRepository.findOneBy({ id });
    if (!background) {
      throw new NotFoundException(`Background with ID ${id} not found.`);
    }
    return background;
  }

  findAll() {
    return this.backgroundRepository.find();
  }
}
