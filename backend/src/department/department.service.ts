import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
    constructor(@InjectModel(Department) private departmentModel: typeof Department) { }

    create(dto: CreateDepartmentDto) {
        return this.departmentModel.create({ Name: dto.Name });
    }

    findAll() {
        return this.departmentModel.findAll();
    }

    async findOne(id: string) {
        const department = await this.departmentModel.findByPk(id);
        if (!department) throw new NotFoundException('Департамент не знайдено');
        return department;
    }

    async remove(id: string) {
        const department = await this.findOne(id);
        await department.destroy();
    }
}
