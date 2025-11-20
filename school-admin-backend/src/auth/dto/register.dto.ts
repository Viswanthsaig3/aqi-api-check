import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@school.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
