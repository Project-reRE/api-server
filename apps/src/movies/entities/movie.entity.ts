import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    provider: string;

    @Column()
    name: string;

    @Column()
    nameOrg: string;

    @Column()
    prodYear: number;

    @Column()
    poster: string;

    @Column()
    genre: string;

    @Column()
    director: string;

    @Column()
    actor: string;

    @Column()
    @Exclude()
    resData: string;
    
}
