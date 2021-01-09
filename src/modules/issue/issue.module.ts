import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueController } from './issue.controller';
import { IssueRepository } from './issue.repository';
import { IssueService } from './issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueRepository])],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
