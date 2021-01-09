import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Agent, UpdateAgentDto } from './dto';
import { AgentEntity } from './agent.entity';
import { AgentStatus } from './agent.enum';

@EntityRepository(AgentEntity)
export class AgentRepository extends Repository<AgentEntity> {
  async createAgent(agentDto): Promise<Agent> {
    const createdAgent = await this.save(agentDto);
    return plainToClass(Agent, createdAgent);
  }

  async findAvailableAgentId(): Promise<string> {
    const agent = await this.findOne({
      where: {
        status: AgentStatus.AVAILABLE,
      },
    });
    if (!agent) return null;

    return agent.id;
  }

  async getAgentList(): Promise<Agent[]> {
    const agentList = await this.find();

    return plainToClass(Agent, agentList);
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
