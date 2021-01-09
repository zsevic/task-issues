import { EntityRepository, Repository } from 'typeorm';
import { AgentEntity } from './agent.entity';
import { AgentStatus } from './agent.enum';
import { UpdateAgentDto } from './dto';

@EntityRepository(AgentEntity)
export class AgentRepository extends Repository<AgentEntity> {
  async findAvailableAgentId(): Promise<string> {
    const agent = await this.findOne({
      where: {
        status: AgentStatus.AVAILABLE,
      },
    });
    if (!agent) return null;

    return agent.id;
  }

  async updateAgent(agentDto: UpdateAgentDto): Promise<void> {
    const agent = await this.findOne(agentDto.id);
    if (!agent) {
      throw new Error('Agent is not valid');
    }

    await this.save({
      ...agent,
      ...agentDto,
    });
  }
}
