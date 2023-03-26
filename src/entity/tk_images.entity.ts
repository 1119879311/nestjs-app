import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from "./tk_common";



/**
 * 用户实体
 */
@Entity("tk_images")
export class tk_images extends tk_common{
  
    @Column({nullable:true,comment:'标题'})  // 唯一
    title:string

    @Column({nullable:true,comment:'简述'})  // 唯一
    remark:string

    @Column({nullable:false,comment:'图片'})
    urls:string

    @Column({nullable:true,comment:'分类'})
    cid:string

  

    
}
