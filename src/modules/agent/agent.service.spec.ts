import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AgentStatus } from 'modules/agent/agent.enum';
import { IssueStatus } from 'modules/issue/issue.enum';
import { IssueRepository } from 'modules/issue/issue.repository';
import { AgentRepository } from './agent.repository';
import { AgentService } from './agent.service';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
}));

describe('AgentService', () => {
  let agentService: AgentService;
  let agentRepository: AgentRepository;
  let issueRepository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentRepository, AgentService, IssueRepository],
    }).compile();

    agentService = module.get<AgentService>(AgentService);
    agentRepository = module.get<AgentRepository>(AgentRepository);
    issueRepository = module.get<IssueRepository>(IssueRepository);
  });

  it('should create a new agent', async () => {
    jest.spyOn(issueRepository, 'getPendingIssueId').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'save').mockResolvedValue(null);

    await expect(agentService.createAgent({ name: 'Agent 1' })).resolves.toBe(
      undefined,
    );
  });

  it('should resolve an issue', async () => {
    const agentId = '265f46b4-2298-455d-88b7-fd79ff624dfb';
    const agentName = 'Agent 1';
    const issueId = 'e18e44eb-6a3d-425b-ad9d-5d9b0a925850';
    const issueTitle = 'issue 1';
    jest.spyOn(issueRepository, 'getPendingIssueId').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue({
      id: agentId,
      name: agentName,
      status: AgentStatus.ASSIGNED,
    });
    jest.spyOn(agentRepository, 'save').mockResolvedValue({
      id: agentId,
      name: agentName,
      status: AgentStatus.AVAILABLE,
    });
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue({
      id: issueId,
      agent_id: agentId,
      status: IssueStatus.ASSIGNED,
      title: issueTitle,
    });
    jest.spyOn(issueRepository, 'save').mockResolvedValue({
      id: issueId,
      agent_id: agentId,
      status: IssueStatus.RESOLVED,
      title: issueTitle,
    });

    await expect(agentService.resolveIssue(agentId, issueId)).resolves.toBe(
      undefined,
    );
  });

  it('should throw an error for nonexistent issue', async () => {
    const agentId = '265f46b4-2298-455d-88b7-fd79ff624dfb';
    const issueId = 'cf037c14-9dec-4fef-8022-7f181c151c23';
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);

    await expect(
      agentService.resolveIssue(agentId, issueId),
    ).rejects.toThrowError(BadRequestException);
  });
});
