import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { CreateIssueDto } from './create-issue.dto';
import { Issue } from './issue.dto';
import { IssueEntity } from './issue.entity';

@EntityRepository(IssueEntity)
export class IssueRepository extends Repository<IssueEntity> {
  async createIssue(issue: CreateIssueDto): Promise<Issue> {
    const createdIssue = await this.save(issue);
    return plainToClass(Issue, createdIssue);
  }

  async getIssueList(): Promise<Issue[]> {
    const issueList = await this.find();
    return plainToClass(Issue, issueList);
  }
}
