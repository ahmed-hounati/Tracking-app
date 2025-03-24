import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHistoriqDto {
  @IsNotEmpty()
  @IsString()
  searchedUserId: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
