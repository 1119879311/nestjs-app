import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from "./tk_common";
import { tk_role } from "./tk_role.entity";
import {tk_tenant} from "./tk_tenant.entity"


/**
 * 用户实体
 */

@Entity("tk_user")
export class tk_user extends tk_common{
   
    @Column({comment:"用户名",unique:true,})
    name:string

    @Column({comment:"用户密码",select:false}) //select 查询的时候隐藏该字段
    password:string

    @Column({type:'int',default:3,comment:'用户类型：1超级用户,2系统用户,3.普通用户,4.游客、测试用户'})
    user_type:number

    @Column({length: 45,nullable:true,unique:true,comment:"联系方式"})
    contact:string

    @Column({length: 45,nullable:true,unique:true,comment:"邮箱"})
    email:string
    
    @Column({type:'int',comment:'当前的选择的租户',nullable:true})
    current_tenant:number

    // @Column({type:"simple-array",comment:"所属租户列表"})
    @ManyToMany(() => tk_tenant, tenant => tenant.users)
    @JoinTable({
        name: 'tk_user_tenant',
        joinColumns: [  {name: 'u_id'} ],
        inverseJoinColumns: [ {name: 't_id'}]
    })
    tenants: tk_tenant[];

    @ManyToMany(() => tk_role, role => role.users)
    @JoinTable({
        name: 'tk_user_role',
        joinColumns: [  {name: 'u_id'} ],
        inverseJoinColumns: [ {name: 'r_id'}]
    })
    roles: tk_role[]
}