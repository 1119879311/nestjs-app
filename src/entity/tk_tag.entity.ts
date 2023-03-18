import { tk_article } from '@/entity/tk_article.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


/**
 *
 */
@Entity("tk_tag")
export class tk_tag{
    @PrimaryGeneratedColumn({comment:'id'})
    id:number

    @Column({unique:true,comment:'tab名称',nullable:false})  // 唯一
    name:string

    @Column({type:'int',unique:false,comment:'状态：1是启用，其他是禁用'})
    status:number

    @Column({type:'int',default:10,unique:false,comment:'排序'})
    sort:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string


    @ManyToMany(type => tk_article, article => article.tags)
    articles: tk_article[];

}
