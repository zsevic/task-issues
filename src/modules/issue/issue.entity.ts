import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentEntity } from 'modules/agent/agent.entity';

@Entity('issue')
export class IssueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  agent_id?: string;

  @Column()
  title: string;

  @Column()
  status: string;

  @ManyToOne(() => AgentEntity, (agentEntity) => agentEntity.issues)
  @JoinColumn({ name: 'agent_id' })
  agent: AgentEntity;
}
