import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Position } from './models/position.model';
import { CreatePositionDto } from './dto/create-position.dto';

@Injectable()
export class PositionService {
    constructor(@InjectModel(Position) private positionModel: typeof Position) { }

    create(dto: CreatePositionDto) {
        return this.positionModel.create({ Name: dto.Name });
    }

    findAll() {
        return this.positionModel.findAll();
    }

    async findOne(id: string) {
        const position = await this.positionModel.findByPk(id);
        if (!position) throw new NotFoundException('Позиція не знайдена');
        return position;
    }

    async remove(id: string) {
        const position = await this.findOne(id);
        await position.destroy();
    }
}
