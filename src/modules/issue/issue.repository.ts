import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Issue } from './dto';
import { IssueEntity } from './issue.entity';

@EntityRepository(IssueEntity)
export class IssueRepository extends Repository<IssueEntity> {
  async createIssue(issue: Issue): Promise<Issue> {
    const createdIssue = await this.save(issue);
    return plainToClass(Issue, createdIssue);
  }

  async getIssueList(): Promise<Issue[]> {
    const issueList = await this.find();
    return plainToClass(Issue, issueList);
  }
}
