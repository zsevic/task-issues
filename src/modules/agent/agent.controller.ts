import { Body, Controller } from '@nestjs/common';
import { Agent, CreateAgentDto } from './dto';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  async createAgent(@Body() agent: CreateAgentDto): Promise<void> {
    return this.agentService.createAgent(agent);
  }

  async getAgentList(): Promise<Agent[]> {
    return this.agentService.getAgentList();
  }
}
