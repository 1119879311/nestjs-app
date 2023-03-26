import { tk_tenant } from '@/entity/tk_tenant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
   
    @InjectRepository(tk_tenant) private readonly tkTenantRepository: Repository<tk_tenant>,
    ){}
   async create(createTenantDto: CreateTenantDto) {
    // this.tkTenantRepository.findBy({})
     return await this.tkTenantRepository.save(createTenantDto)
    
    
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
