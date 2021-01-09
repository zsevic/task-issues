import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IssueEntity } from 'modules/issue/issue.entity';

@Entity('agent')
export class AgentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  status: string;

  @OneToMany(() => IssueEntity, (issueEntity) => issueEntity.agent)
  issues: IssueEntity[];
}
