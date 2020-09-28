import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_user_role } from './tk_user_role.entity';
/**
 * 角色实体
 */
@Entity("tk_role")
export class tk_role{
    @PrimaryGeneratedColumn({comment:'角色id'})
    id:number

    @Column({unique:true,comment:'角色名称',nullable:false})  // 唯一
    name:string

    @Column({comment:'角色描述',nullable:true})  // 唯一
    title:string

    @Column({comment:'角色类型',default:1,nullable:false})  // 唯一
    role_type:number
    
    @Column({comment:'角色的父级id (所属)',nullable:true})  // 唯一
    pid:number

    @Column({type:'int',default:1,unique:false,comment:'用户状态：1是启用，其他是禁用'})
    status:number

    @Column({type:'int',default:10,unique:false,comment:'排序'})
    sort:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatatime: string

    @OneToMany(type => tk_user_role, userRole => userRole.users)
    userRoles: tk_user_role[];
}