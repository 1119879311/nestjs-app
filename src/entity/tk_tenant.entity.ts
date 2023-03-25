
import { Column, Entity  } from "typeorm";
import { tk_common } from "./tk_common";


/**
 * 实体
 */
@Entity("tk_tenant")
export class tk_tenant extends tk_common{
   
    @Column({unique:true,comment:'租户名称',nullable:true})  // 唯一
    name:string

    @Column({type:'int',unique:false,default:3,comment:'租户数据共存方式：1、公开,2、租户内共享,3、用户私有化'})
    data_access:number

    @Column({type:'int',default:0,unique:false,comment:'排序'})
    sort:number

}
