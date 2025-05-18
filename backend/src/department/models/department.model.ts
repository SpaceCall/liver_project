import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    Unique,
    HasMany,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';

@Table({
    tableName: 'departments',
    timestamps: true,                        
    paranoid: true,                     
})
export class Department extends Model<Department> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    Id: string;

    @AllowNull(false)
    @Unique
    @Column({ type: DataType.STRING })
    Name: string;

    @HasMany(() => User)
    Users: User[];
}
