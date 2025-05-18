import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Injectable()
export class ConfigService {
    constructor(private configService: NestConfigService) { }

    get(key: string): string {
        return this.configService.get<string>(key);
    }
    getModelApiConfig() {
        return {
            url: this.get('MODEL_API_URL'),
        };
    }
      
    getDatabaseConfig() {
        return {
            dialect: 'postgres' as Dialect,
            host: this.get('DATABASE_HOST'),
            port: parseInt(this.get('DATABASE_PORT'), 10),
            username: this.get('DATABASE_USER'),
            password: this.get('DATABASE_PASSWORD'),
            database: this.get('DATABASE_NAME'),
        };
    }
}
