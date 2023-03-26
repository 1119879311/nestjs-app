import { tk_article } from '@/entity/tk_article.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from './tk_common';


/**
 *
 */
@Entity("tk_tag")
export class tk_tag extends tk_common{
   

    @Column({unique:true,comment:'tab名称',nullable:false})  // 唯一
    name:string


    @ManyToMany(type => tk_article, article => article.tags)
    articles: tk_article[];

}
