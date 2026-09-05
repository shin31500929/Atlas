import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Post()
  create(@Body() body: { title: string; startedAt: string }) {
    return this.recordsService.create(body);
  }

  @Patch(':id')
  end(@Param('id') id: string) {
    return this.recordsService.end(id);
  }

  @Patch(':id/details')
  updateDetails(
    @Param('id') id: string,
    @Body()
    body: {
      story?: string | null;
      tags?: string[];
    },
  ) {
    return this.recordsService.updateDetails(id, body);
  }

  @Post(':id/locations')
  addLocation(
    @Param('id') id: string,
    @Body()
    body: {
      latitude: number;
      longitude: number;
      recordedAt: string;
    },
  ) {
    return this.recordsService.addLocation(id, body);
  }

  @Get(':id/locations')
  findLocations(@Param('id') id: string) {
    return this.recordsService.findLocations(id);
  }
}
