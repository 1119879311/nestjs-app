
import { Column, Entity, ManyToMany  } from "typeorm";
import { tk_common } from "./tk_common";
import {tk_user} from "./tk_user.entity"

/**
 * 实体
 */
@Entity("tk_tenant")
export class tk_tenant extends tk_common{
   
    @Column({unique:true,comment:'租户名称'})  // 唯一
    name:string

    @Column({type:'int',default:1,comment:'租户数据共存方式：1、用户私有化 ,2、租户内共享,3、公开',})
    data_access:number

    @Column({comment:'租户类型1:系统预设,2:普通租户',default:2})  //
    tenant_type:number

    @Column({comment:'租户描述',nullable:true})  
    desc:string

    @ManyToMany(type => tk_user, user => user.tenants)
    users: tk_user[];

}
