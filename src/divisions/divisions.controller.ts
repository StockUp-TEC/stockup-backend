import { Body, Controller, Param, Post } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';

@Controller('workspaces/:workspaceId/divisions')
export class DivisionsController {
  constructor(private readonly divisionService: DivisionsService) {}

  @Post()
  createDivision(
    @Param('workspaceId') workspaceId: number,
    @Body() divisionData: CreateDivisionDto,
  ) {
    return this.divisionService.addDivisionToWorkspace(
      +workspaceId,
      divisionData,
    );
  }
}
