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
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'save').mockResolvedValue({
      id: '83b4ec60-8aec-488f-80ce-4829af386498',
      name: 'Agent 1',
      status: AgentStatus.AVAILABLE,
    });

    await expect(agentService.createAgent({ name: 'Agent 1' })).resolves.toBe(
      undefined,
    );
  });

  it('should create a new agent and assign the agent to a pending issue', async () => {
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue({
      id: '058c7f36-cdef-4585-b828-0965a0110b2e',
      title: 'issue 1',
      status: IssueStatus.PENDING,
    });
    jest.spyOn(issueRepository, 'save').mockResolvedValue({
      id: '058c7f36-cdef-4585-b828-0965a0110b2e',
      title: 'issue 1',
      status: IssueStatus.ASSIGNED,
      agent_id: '5cfcf4f2-5dfc-4f95-8442-1f7493939fe5',
    });
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'save').mockResolvedValue({
      id: '5cfcf4f2-5dfc-4f95-8442-1f7493939fe5',
      name: 'Agent 1',
      status: AgentStatus.ASSIGNED,
    });

    await expect(agentService.createAgent({ name: 'Agent 1' })).resolves.toBe(
      undefined,
    );
  });

  it('should resolve an issue', async () => {
    const agentId = '265f46b4-2298-455d-88b7-fd79ff624dfb';
    const agentName = 'Agent 1';
    const issueId = 'e18e44eb-6a3d-425b-ad9d-5d9b0a925850';
    const issueTitle = 'issue 1';
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

  it('should resolve an issue and assign agent to a pending issue', async () => {
    const agentId = '265f46b4-2298-455d-88b7-fd79ff624dfb';
    const issueId = 'e18e44eb-6a3d-425b-ad9d-5d9b0a925850';
    const issueTitle = 'issue 1';
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
    jest
      .spyOn(issueRepository, 'getPendingIssueId')
      .mockResolvedValue('0ae812ab-5e21-435d-a87b-215b146c1117');
    jest.spyOn(issueRepository, 'assignIssue').mockResolvedValue();

    await expect(agentService.resolveIssue(agentId, issueId)).resolves.toBe(
      undefined,
    );
  });
});
