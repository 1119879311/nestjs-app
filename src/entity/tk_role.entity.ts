import { tk_authority } from './tk_authority.entity';
import { tk_user } from '@/entity/tk_user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from './tk_common';
// import { tk_user_role } from './tk_user_role.entity';
/**
 * 角色实体
 */
@Entity("tk_role")
export class tk_role extends tk_common{
 
    @Column({unique:true,comment:'角色名称',nullable:false})  // 唯一
    name:string

    @Column({comment:'角色描述',nullable:true})  
    desc:string

    @Column({comment:'角色类型1:系统预设,2:普通角色',default:1})  //
    role_type:number
    
    // @Column({comment:'角色的父级id (所属)',nullable:true})  // 唯一
    // pid:number

  

    // @OneToMany(type => tk_user_role, userRole => userRole.users)
    // roleUsers: tk_user_role[];
    @ManyToMany(type => tk_user, user => user.roles)
    users: tk_user[];

    @ManyToMany(type => tk_authority, auth => auth.roles)
    @JoinTable({
        name: 'tk_role_authority',
        joinColumns: [  {name: 'r_id'} ],
        inverseJoinColumns: [ {name: 'a_id'}]
    })
    auths: tk_authority[]
}