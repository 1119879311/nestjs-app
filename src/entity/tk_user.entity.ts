import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {tk_user_role} from "./tk_user_role.entity"

/**
 * 用户实体
 */

@Entity("tk_user")
export class tk_user{
    @PrimaryGeneratedColumn({comment:'用户id'})
    id:number

    @Column({comment:"用户名",nullable:false})
    name:string

    @Column({comment:"用户密码",nullable:false})
    password:string

    @Column({unique:true,comment:'唯一token',nullable:false})  // 唯一
    @Generated("uuid") // 自动生成列
    token: string;

    @Column({length: 45,unique:false,comment:"联系方式"})
    contact:string

    @Column({length: 45,unique:true,comment:"邮箱"})
    email:string
    
    @Column({type:'int',default:3,unique:false,comment:'用户类型：1是超级用户，2是内部用户(二级),3是其他用户(三级)'})
    user_type:number

    @Column({type:'int',default:1,unique:false,comment:'用户状态：1是启用，其他是禁用'})
    status:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @CreateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatatime: string

    @OneToMany(type => tk_user_role, userRole => userRole.roles)
    userRoles: tk_user_role[];
}