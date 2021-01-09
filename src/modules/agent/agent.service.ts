import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { v4 as uuidv4 } from 'uuid';
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
    const agentId = uuidv4();

    const agentStatus = await this.assignPendingIssueIfAny(agentId);
    await this.agentRepository.upsertAgent({
      ...agent,
      id: agentId,
      status: agentStatus,
    });
  }

  async getAgentList(): Promise<Agent[]> {
    return this.agentRepository.getAgentList();
  }

  async getIssueList(agentId: string): Promise<Issue[]> {
    return this.issueRepository.getIssueListByAgentId(agentId);
  }

  @Transactional()
  async resolveIssue(agentId: string, issueId: string): Promise<void> {
    await this.issueRepository.updateIssue({
      id: issueId,
      agent_id: agentId,
      status: IssueStatus.RESOLVED,
    });

    const agentStatus = await this.assignPendingIssueIfAny(agentId);
    await this.agentRepository.upsertAgent({
      id: agentId,
      status: agentStatus,
    });
  }

  private async assignPendingIssueIfAny(agentId: string): Promise<string> {
    let agentStatus = AgentStatus.AVAILABLE;
    const pendingIssueId = await this.issueRepository.getPendingIssueId();
    if (pendingIssueId) {
      agentStatus = AgentStatus.WORKING;
      await this.issueRepository.updateIssue({
        id: pendingIssueId,
        status: IssueStatus.ASSIGNED,
        agent_id: agentId,
      });
    }

    return agentStatus;
  }
}
