import { plainToClass } from 'class-transformer';
import { IssueStatus } from 'modules/issue/issue.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Issue, UpdateIssueDto } from './dto';
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

  async getPendingIssueId(): Promise<string> {
    const issue = await this.findOne({
      where: {
        status: IssueStatus.PENDING,
      },
    });
    if (!issue) return null;

    return issue.id;
  }

  async updateIssue(issueDto: UpdateIssueDto): Promise<void> {
    const issue = await this.findOne(issueDto.id);
    if (!issue) {
      throw new Error('Issue is not valid');
    }
    await this.save({
      ...issue,
      ...issueDto,
    });
  }
}
