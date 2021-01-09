import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Issue } from 'modules/issue/dto';
import { IssueStatus } from 'modules/issue/issue.enum';
import { IssueRepository } from 'modules/issue/issue.repository';
import { Agent, CreateAgentDto } from './dto';
import { AgentStatus } from './agent.enum';
import { AgentRepository } from './agent.repository';

@Injectable()
export class AgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  @Transactional()
  async createAgent(agent: CreateAgentDto): Promise<void> {
    const pendingIssueId = await this.issueRepository.getPendingIssueId();
    let agentStatus = AgentStatus.AVAILABLE;
    if (pendingIssueId) {
      agentStatus = AgentStatus.WORKING;
      await this.issueRepository.updateIssue({
        id: pendingIssueId,
        status: IssueStatus.ASSIGNED,
      });
    }
    await this.agentRepository.createAgent({
      ...agent,
      status: agentStatus,
    });
  }

  async getAgentList(): Promise<Agent[]> {
    return this.agentRepository.getAgentList();
  }

  async getIssueList(agentId: string): Promise<Issue[]> {
    return this.issueRepository.getIssueListByAgentId(agentId);
  }
}
