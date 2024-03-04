/**
 * 资源表
 */



import { tk_role } from './tk_role.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from './tk_common';

@Entity("tk_resource")
export class tk_resource extends tk_common{
  

    @Column({comment:'资源名称'})  // 唯一
    name:string

    @Column({unique:true,comment:'资源唯一标记'})  // 唯一
    code:string

    @Column({comment:'资源内容',default:'',nullable:false})  
    content:string

    @Column({type:'int',unique:false,comment:'资源类型：1是菜单(与前端关联),2是api接口(与后端关联),3页面路由'})
    resource_type:number

    @Column({default:null,comment:'资源所属应用'})
    application:string

    @Column({comment:'上级id',default:null})  
    pid:number


    @ManyToMany(() => tk_role, role => role.resources, { cascade: true })
    roles: tk_role[];
}
