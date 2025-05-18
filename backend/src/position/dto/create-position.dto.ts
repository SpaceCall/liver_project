import { IsNotEmpty, Length } from 'class-validator';

export class CreatePositionDto {
    @IsNotEmpty()
    @Length(2, 100)
    Name: string;
}