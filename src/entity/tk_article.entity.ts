import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from "./tk_common";

import { tk_tag } from "./tk_tag.entity";

/**
 * 用户实体
 */
@Entity("tk_article")
export class tk_article extends tk_common{
  

    @Column({nullable:false,comment:'标题'})  // 唯一
    title:string

    @Column({nullable:true,comment:'简述'})  // 唯一
    remark:string

    @Column({nullable:false,comment:'内容',select:false})  // 唯一
    content:string

    @Column({nullable:true,comment:'图片'})
    thumimg:string

    @Column({type:'int',nullable:true,comment:'分类'})
    cid:number

  

    @ManyToMany(type => tk_tag, tag => tag.articles)
    @JoinTable({
        name: 'tk_article_tag',
        joinColumns: [  {name: 'a_id'} ],
        inverseJoinColumns: [ {name: 't_id'}]
    })
    tags: tk_tag[]
}
