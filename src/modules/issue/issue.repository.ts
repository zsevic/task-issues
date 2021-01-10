import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Issue, UpdateIssueDto } from './dto';
import { IssueStatus } from './issue.enum';
import { IssueEntity } from './issue.entity';

@EntityRepository(IssueEntity)
export class IssueRepository extends Repository<IssueEntity> {
  async assignIssue(issueId: string, agentId: string): Promise<void> {
    const issue = await this.findOne({
      where: {
        id: issueId,
        status: IssueStatus.PENDING,
      },
    });
    if (!issue) {
      throw new BadRequestException("Issue doesn't exists");
    }
    await this.save({
      ...issue,
      agent_id: agentId,
      status: IssueStatus.ASSIGNED,
    });
  }

  async createIssue(newIssue: Issue): Promise<void> {
    const issue = await this.findOne({
      where: {
        title: newIssue.title,
      },
    });
    if (issue) {
      throw new BadRequestException('Issue already exists');
    }
    await this.save(issue);
  }

  async getIssueList(): Promise<Issue[]> {
    const issueList = await this.find();
    return plainToClass(Issue, issueList);
  }

  async getIssueListByAgentId(agentId: string): Promise<Issue[]> {
    const issueList = await this.find({
      where: {
        agent_id: agentId,
      },
    });
    return plainToClass(Issue, issueList);
  }

  async getPendingIssueId(): Promise<string> {
    const issue = await this.findOne({
      where: {
        status: IssueStatus.PENDING,
      },
    });
    if (!issue) return null;

    return issue.id;
  }

  async resolveIssue(issueId: string, agentId: string): Promise<void> {
    const issue = await this.findOne({
      where: {
        id: issueId,
        agent_id: agentId,
        status: IssueStatus.ASSIGNED,
      },
    });
    if (!issue) {
      throw new BadRequestException("Issue doesn't exists");
    }
    await this.save({
      ...issue,
      status: IssueStatus.RESOLVED,
    });
  }
}
