import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';

@Controller('positions')
export class PositionController {
    constructor(private readonly service: PositionService) { }

    @Post()
    create(@Body() dto: CreatePositionDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
