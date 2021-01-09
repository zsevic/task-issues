import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateIssueDto, Issue } from './dto';
import { IssueService } from './issue.service';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post()
  async createIssue(@Body() issue: CreateIssueDto): Promise<void> {
    return this.issueService.createIssue(issue);
  }

  @Get()
  async getIssueList(): Promise<Issue[]> {
    return this.issueService.getIssueList();
  }
}
