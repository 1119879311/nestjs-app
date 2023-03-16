import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { modifyStatusAllDto } from 'src/shared/dto/index.dto';
import { isToEmpty } from 'src/shared/util';
import { tk_classify } from 'src/entity/tk_classify.entity';
import { getManager, Repository } from 'typeorm';
import { FindClassifyListDto, SavaClassifyDto } from './dto/index.dto';

@Injectable()
export class ClassifyService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(tk_classify) private readonly tkClassifyRepository: Repository<tk_classify>,
    ) { }
    async findList(data: FindClassifyListDto) {
        const whereVal: any = {}
        const wherekey: string[] = []

        if (isToEmpty(data.startTime)) {
            wherekey.push(' c.createtime >= :startTime ')
            whereVal['startTime'] = data.startTime
        }

        if (isToEmpty(data.endTime)) {
            wherekey.push(' c.createtime <= :endTime ')
            whereVal['endTime'] = data.endTime
        }
        if (isToEmpty(data.name)) {
            wherekey.push(` c.name like '%${data.name}%' `)
        }

        const page = (data.page || this.configService.get("page")) - 1;
        const offset = data.offset || this.configService.get("offset");
        const resBuild = await this.tkClassifyRepository
            .createQueryBuilder('c')
            // .leftJoinAndMapOne('c.parent',tk_classify, 'parent', 'c.pid=parent.id')
            .where(wherekey.join(' AND '), whereVal)
            .orderBy({ "c.sort": "DESC" })

        if (data.isPage) {
            const res = await resBuild.getMany()
            return { rows: res, total: 0 }
        } else {
            const res = await resBuild.skip(page * offset).take(offset).getManyAndCount();
            return { rows: res[0], total: res[1] };
        }

    }

    async save(data: SavaClassifyDto) {
       
        const saveData = new tk_classify()
        saveData.name = data.name
        saveData.sort = data.sort || 10
        saveData.status = data.status || 1
        saveData.pid = data.pid || 0
        if (data.id) {
            const res = await this.tkClassifyRepository.update({ id: data.id }, saveData)
            return res.affected;
        } else {
            try {
                const res = await this.tkClassifyRepository.createQueryBuilder("c")
                    .insert().values(saveData).execute()
                return res.identifiers[0].id;
            } catch (error) {
                throw new BadRequestException("新增失败,标签名重复")
            }

        }

    }
    //单个/批量
    async modifyStatusUser(data: modifyStatusAllDto) {
        const res = await this.tkClassifyRepository.createQueryBuilder("a").update(tk_classify)
            .set({ status: data.status }).where("id in (:id)", { id: data.ids.split(',') }).execute();
        if (res.affected > 0) {
            return res.affected
        }
        throw new BadRequestException('修改失败，该数据不存在')
    }
    //但个删除
    async delete(id: number) {
        const res = await this.tkClassifyRepository.findOne(id)
        if (!res || res.status === 1) {
            throw new BadRequestException("删除失败,数据不存在或者处于正常态无法删除")
        }
        //事务写法(隐式)
        return await getManager().transaction(async transactionalEntityManager => {
            await transactionalEntityManager.createQueryBuilder()
                .delete().from(tk_classify, 'c')
                .where("id=:id AND status=2", { id: id })
                .execute()
            const sql = `update tK_classify as c1,(select id from tk_classify where pid=?) as c2 set c1.pid=? where c1.id in (c2.id)`
            await transactionalEntityManager.query(sql, [id, res.pid])
        })
            .then(() => null)
            .catch(err => {
                console.log(err)
                throw new BadRequestException("删除失败")
            });
    }
   
    async findClassifyIdChild(id: number, isSql?: false) {
        
        const sql = `
            SELECT data1.level, data2.* FROM( 
                SELECT  @ids as _ids, 
                (SELECT @ids := GROUP_CONCAT(id)  FROM tk_classify  WHERE FIND_IN_SET(pid, @ids) ) as cids, 
                @l := @l+1 as level  FROM tk_classify, 
                (SELECT @ids :=?, @l := 0 ) b 
                WHERE @ids IS NOT NULL 
            ) data1, tk_classify data2 
            WHERE FIND_IN_SET(data2.id, data1._ids) 
            ORDER BY level, id
        `
        if (isSql) {
            return { sql, data: [id] }
        }
        const res: any[] = await getManager().query(sql, [id, id])
        return res.map(itme => itme.id);
    }
    /**
     * 找所有下级和自己
     * @param value    T
     * @param field ：id|name
     * @param isSql   booeam
     */
    async findClassifyChild<T>(value: T,field:'id'|'name'='id', isSql?: false) {
        
        let sql = `
            SELECT data1.level, data2.* FROM( 
                SELECT  @ids as _ids, 
                (SELECT @ids := GROUP_CONCAT(id)  FROM tk_classify  WHERE FIND_IN_SET(pid, @ids) ) as cids, 
                @l := @l+1 as level  FROM tk_classify, 
                (SELECT @ids :=:field, @l := 0 ) b 
                WHERE @ids IS NOT NULL 
            ) data1, tk_classify data2 
            WHERE FIND_IN_SET(data2.id, data1._ids) 
            ORDER BY level, id
        `
        const insertSql = 'select id from tk_classify where name=?';
       
        if(field==='id'){
            sql = sql.replace(new RegExp(":field",'ig'),`?`)
        }else{
            sql = sql.replace(new RegExp(":field",'ig'),`(${insertSql})`)
        }
        if (isSql) {
            return { sql, data: [value] }
        }
        let res: any[] = await getManager().query(sql, [value])
        res = res.map(itme => itme.id);
        return res.length?res:[''];
    }

    
}
