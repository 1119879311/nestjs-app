import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_role } from "./tk_role.entity";
// import {tk_user_role} from "./tk_user_role.entity"

/**
 * 用户实体
 */

@Entity("tk_user")
export class tk_user{
    @PrimaryGeneratedColumn({comment:'用户id'})
    id:number

    @Column({comment:"用户名",unique:true,nullable:false})
    name:string

    @Column({comment:"用户密码",nullable:false,select:false})
    password:string

    @Column({unique:true,comment:'唯一token',nullable:false,select:false})  // 唯一
    @Generated("uuid") // 自动生成列
    token: string;

    @Column({length: 45,default:null,unique:false,comment:"联系方式"})
    contact:string

    @Column({length: 45,default:null,unique:false,comment:"邮箱"})
    email:string
    
    @Column({type:'int',comment:"上级用户pid,由谁创建的"})
    pid:number

    @Column({type:'int',unique:false,comment:'用户类型：1超级用户,2是系统用户,3其他用户'})
    user_type:number

    @Column({type:'int',default:1,unique:false,comment:'用户状态：1是启用，其他是禁用'})
    status:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string

    // @OneToMany(type => tk_user_role, userRole => userRole.roles)
    // userRoles: tk_user_role[];
    @ManyToMany(type => tk_role, role => role.users)
    @JoinTable({
        name: 'tk_user_role',
        joinColumns: [  {name: 'u_id'} ],
        inverseJoinColumns: [ {name: 'r_id'}]
    })
    roles: tk_role[]
}