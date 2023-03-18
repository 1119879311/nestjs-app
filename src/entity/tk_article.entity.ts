import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { tk_tag } from "./tk_tag.entity";

/**
 * 用户实体
 */
@Entity("tk_article")
export class tk_article{
    @PrimaryGeneratedColumn({comment:'id'})
    id:number

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

    @Column({type:'int',default:10,unique:false,comment:'排序'})
    sort:number

    @Column({type:'int',default:1,unique:false,comment:'状态：1是启用，其他是禁用'})
    status:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string

    @ManyToMany(type => tk_tag, tag => tag.articles)
    @JoinTable({
        name: 'tk_article_tag',
        joinColumns: [  {name: 'a_id'} ],
        inverseJoinColumns: [ {name: 't_id'}]
    })
    tags: tk_tag[]
}
