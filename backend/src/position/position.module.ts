import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Position } from './models/position.model';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';

@Module({
    imports: [SequelizeModule.forFeature([Position])],
    providers: [PositionService],
    controllers: [PositionController],
    exports: [PositionService],
})
export class PositionModule { }