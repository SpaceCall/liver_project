import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from './models/department.model';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';

@Module({
    imports: [SequelizeModule.forFeature([Department])],
    providers: [DepartmentService],
    controllers: [DepartmentController],
    exports: [DepartmentService],
})
export class DepartmentModule { }