import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from './create-issue.dto';
import { Issue } from './issue.dto';
import { IssueRepository } from './issue.repository';

@Injectable()
export class IssueService {
  constructor(private readonly issueRepository: IssueRepository) {}

  async createIssue(issue: CreateIssueDto): Promise<Issue> {
    return this.issueRepository.createIssue(issue);
  }

  async getIssueList(): Promise<Issue[]> {
    return this.issueRepository.getIssueList();
  }
}
