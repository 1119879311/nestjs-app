import { tk_role } from './tk_role.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from './tk_common';

@Entity("tk_authority")
export class tk_authority extends tk_common{
  

    @Column({comment:'资源名称'})  // 唯一
    title:string

    @Column({unique:true,comment:'资源唯一标记'})  // 唯一
    sign_name:string

    @Column({comment:'资源地址'})  
    url:string

    @Column({type:'int',unique:false,comment:'资源类型：1是菜单(与前端关联),2是api接口(与后端关联),3页面路由'})
    auth_type:number

    @Column({comment:'上级id'})  
    pid:number


    @ManyToMany(() => tk_role, role => role.auths, { cascade: true })
    roles: tk_role[];
}
