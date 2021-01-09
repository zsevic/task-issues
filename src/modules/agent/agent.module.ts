import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueRepository } from 'modules/issue/issue.repository';
import { AgentController } from './agent.controller';
import { AgentRepository } from './agent.repository';
import { AgentService } from './agent.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentRepository, IssueRepository])],
  providers: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
