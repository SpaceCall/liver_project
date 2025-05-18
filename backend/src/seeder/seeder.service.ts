import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(private readonly userService: UserService) { }

    async onModuleInit() {
        const adminEmail = 'mainAdminHospital@hospital.local';

        const users = await this.userService.findAll();
        const adminExists = users.some(u => u.Email === adminEmail);

        if (!adminExists) {
            const dto: CreateUserDto = {
                FIO: 'Головний Адміністратор',
                Email: adminEmail,
                Password: '58790878283743090',
                IsAdmin: true,
            };

            await this.userService.create(dto);
            console.log('Admin created:', adminEmail);
        } else {
            console.log('Admin already exists:', adminEmail);
        }
    }
}
