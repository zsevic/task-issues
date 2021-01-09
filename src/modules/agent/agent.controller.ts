import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Agent, CreateAgentDto, ResolveIssueDto } from './dto';
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

  @Put(':id/issues/:issueId/resolve')
  async resolveIssue(@Param() params: ResolveIssueDto): Promise<void> {
    return this.agentService.resolveIssue(params.id, params.issueId);
  }
}
