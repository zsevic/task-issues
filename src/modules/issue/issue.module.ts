import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRepository } from 'modules/agent/agent.repository';
import { IssueController } from './issue.controller';
import { IssueRepository } from './issue.repository';
import { IssueService } from './issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentRepository, IssueRepository])],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
