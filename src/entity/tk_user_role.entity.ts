import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import {tk_user} from "./tk_user.entity"
import {tk_role} from './tk_role.entity'
/**
 * 用户-角色关系表 多对多
 */
@Entity('tk_user_role')
export class tk_user_role{
    
    @ManyToOne(type => tk_user, user => user.userRoles, { primary: true })
    @JoinColumn({name: 'u_id'})
    users: tk_user;
 
    @ManyToOne(type => tk_role, role => role.userRoles, { primary: true })
    @JoinColumn({name: 'r_id'})
    roles: tk_role;
}
