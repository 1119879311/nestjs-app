import { tk_role } from './tk_role.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("tk_authority")
export class tk_authority{
    @PrimaryGeneratedColumn({comment:'资源id'})
    id:number

    @Column({comment:'资源名称'})  // 唯一
    title:string

    @Column({unique:true,comment:'资源唯一标记'})  // 唯一
    signName:string

    @Column({comment:'资源地址'})  
    url:string

    @Column({type:'int',unique:false,comment:'资源类型：1是菜单(与前端关联)，2是api接口(与后端关联)'})
    auth_type:number

    @Column({comment:'上级id'})  
    pid:number

    @Column({type:'int',default:1,unique:false,comment:'用户状态：1是启用，其他是禁用'})
    status:number

    @Column({type:'int',default:10,unique:false,comment:'排序'})
    sort:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string

    @ManyToMany(() => tk_role, role => role.auths, { cascade: true })
    roles: tk_role[];
}
