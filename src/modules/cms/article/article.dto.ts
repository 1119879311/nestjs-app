import {  IsDefined, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
// @IsOptional() //如果不传，则跳过验证，如果属性传了就验证上面的规则
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({message:'name 不能为空'})
  name: string;

  @IsNumberString()
  status:number;

  @IsNumberString()
  @IsOptional()
  age:number
}