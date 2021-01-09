import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AgentStatus } from 'modules/agent/agent.enum';
import { AgentRepository } from 'modules/agent/agent.repository';
import { CreateIssueDto } from './create-issue.dto';
import { Issue } from './issue.dto';
import { IssueStatus } from './issue.enum';
import { IssueRepository } from './issue.repository';

@Injectable()
export class IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly agentRepository: AgentRepository,
  ) {}

  @Transactional()
  async createIssue(issue: CreateIssueDto): Promise<void> {
    let issueStatus = IssueStatus.PENDING;
    const availableAgentId = await this.agentRepository.findAvailableAgentId();
    if (availableAgentId) {
      issueStatus = IssueStatus.ASSIGNED;
    }
    await this.issueRepository.createIssue({
      ...issue,
      agent_id: availableAgentId,
      status: issueStatus,
    });
    await this.agentRepository.updateAgent({
      id: availableAgentId,
      status: AgentStatus.WORKING,
    });
  }

  async getIssueList(): Promise<Issue[]> {
    return this.issueRepository.getIssueList();
  }
}
