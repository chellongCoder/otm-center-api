import { Languages, UserWorkspaceTypes, UserWorkspaces } from './../models/user-workspaces.model';
import { SexTypes, StatusUserWorkspaces } from '@/models/user-workspaces.model';
import { IsBoolean, IsEmail, IsISO8601, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Repository } from 'typeorm';
export class UpdateUserWorkspaceDto extends Repository<UserWorkspaces> {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'fullname update', example: 'Huythuhai' })
  fullname: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'nickname update', example: 'Huythuhai' })
  nickname: string;

  @IsISO8601()
  @IsOptional()
  @JSONSchema({ description: 'birthday update', example: '2000-10-16' })
  birthday: Date;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'address update', example: 'nha thu hai' })
  address: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'Sex type is MALE or FEMALE', example: 'MALE' })
  sex: SexTypes;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'avatar image link' })
  avatar: string;

  @IsEmail()
  @IsOptional()
  @JSONSchema({ description: 'email update', example: 'huy@gmail.com' })
  email: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'LANGUAGES is VN or EN', example: 'VI' })
  lang: Languages;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'StatusUserWorkspaces', example: 'ACTIVE' })
  status: StatusUserWorkspaces;

  @IsBoolean()
  @IsOptional()
  @JSONSchema({ description: 'isActive true or fale', example: 'true' })
  isActive: boolean;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  zalo: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  skype: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  classNameLeaning: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  birthplace: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  attachImageUrl: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  schoolName: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  note: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  facebook: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'field update' })
  userWorkspaceType: UserWorkspaceTypes;
}
