import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as crypto from 'crypto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';


@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) { }

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  async create(dto: CreateUserDto): Promise<User> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashPassword(dto.Password, salt);

    const user = await this.userModel.create({
      FIO: dto.FIO,
      Email: dto.Email,
      Hash: hash,
      Salt: salt,
      IsAdmin: dto.IsAdmin,
      DepartmentId: dto.DepartmentId,
      PositionId: dto.PositionId,
    });

    return user;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.findAll({
      include: ['Department', 'Position']
    });

    return users.map(user =>
      plainToInstance(UserResponseDto, user.get({ plain: true }))
    );
  }


  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('Користувача не знайдено');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { Email: email } });
    if (!user) throw new NotFoundException('Користувача не знайдено');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    if ('IsAdmin' in dto) {
      delete (dto as any).IsAdmin;
    }

    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Користувача не знайдено');
    if (dto.Password) {
      const salt = crypto.randomBytes(16).toString('hex');
      user.Salt = salt;
      user.Hash = this.hashPassword(dto.Password, salt);
    }

    await user.update({ ...dto });
    return plainToInstance(UserResponseDto, user.get({ plain: true }));
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }
    if (user.Email === 'mainAdminHospital@hospital.local') {
      throw new BadRequestException('Цього користувача не можна видалити');
    }
    
    await user.destroy();
  }

  async findOneWithRelations(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findByPk(id, {
      include: ['Department', 'Position'],
    });
    if (!user) throw new NotFoundException('Користувача не знайдено');
    return plainToInstance(UserResponseDto, user.get({ plain: true }));
  }
}
