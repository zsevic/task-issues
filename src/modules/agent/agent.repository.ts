import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Agent, UpdateAgentDto } from './dto';
import { AgentEntity } from './agent.entity';
import { AgentStatus } from './agent.enum';

@EntityRepository(AgentEntity)
export class AgentRepository extends Repository<AgentEntity> {
  async getAgentList(): Promise<Agent[]> {
    const agentList = await this.find();

    return plainToClass(Agent, agentList);
  }

  async getAvailableAgentId(): Promise<string> {
    const agent = await this.findOne({
      where: {
        status: AgentStatus.AVAILABLE,
      },
    });
    if (!agent) return null;

    return agent.id;
  }

  async upsertAgent(agentDto: UpdateAgentDto): Promise<void> {
    const agent = await this.findOne(agentDto.id);
    if (!agent) {
      await this.save(agentDto);
      return Promise.resolve();
    }

    await this.save({
      ...agent,
      ...agentDto,
    });
  }
}
