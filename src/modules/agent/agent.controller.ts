import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Agent, CreateAgentDto } from './dto';
import { AgentService } from './agent.service';
import { Issue } from 'modules/issue/dto';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async createAgent(@Body() agent: CreateAgentDto): Promise<void> {
    return this.agentService.createAgent(agent);
  }

  @Get()
  async getAgentList(): Promise<Agent[]> {
    return this.agentService.getAgentList();
  }

  @Get(':id/issues')
  async getIssueList(@Param('id') agentId: string): Promise<Issue[]> {
    return this.agentService.getIssueList(agentId);
  }
}
