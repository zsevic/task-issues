import { Test, TestingModule } from '@nestjs/testing';
import { Issue } from 'modules/issue/dto';
import { IssueStatus } from 'modules/issue/issue.enum';
import { IssueRepository } from 'modules/issue/issue.repository';
import { Agent } from './dto';
import { AgentController } from './agent.controller';
import { AgentStatus } from './agent.enum';
import { AgentRepository } from './agent.repository';
import { AgentService } from './agent.service';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
}));

describe('AgentController', () => {
  let agentController: AgentController;
  let agentRepository: AgentRepository;
  let issueRepository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [AgentService, AgentRepository, IssueRepository],
    }).compile();

    agentController = module.get<AgentController>(AgentController);
    agentRepository = module.get<AgentRepository>(AgentRepository);
    issueRepository = module.get<IssueRepository>(IssueRepository);
  });

  it('should get agent list', async () => {
    const result: Agent[] = [
      {
        id: 'f2403062-7ca9-49b5-911d-4f8ec654e4c3',
        name: 'agent',
        status: AgentStatus.AVAILABLE,
      },
    ];
    jest.spyOn(agentRepository, 'getAgentList').mockResolvedValue(result);

    const agentList: Agent[] = await agentController.getAgentList();

    expect(agentList).toBe(result);
  });

  it('should get issue list by agent id', async () => {
    const agentId = '2012c8bc-bbbb-41fd-b285-966dc98c3626';
    const result: Issue[] = [
      {
        id: 'f2403062-7ca9-49b5-911d-4f8ec654e4c3',
        agent_id: agentId,
        title: 'issue 1',
        status: IssueStatus.ASSIGNED,
      },
    ];
    jest
      .spyOn(issueRepository, 'getIssueListByAgentId')
      .mockResolvedValue(result);

    const issueList: Issue[] = await agentController.getIssueList(agentId);

    expect(issueList).toBe(result);
  });

  it('should resolve an issue', async () => {
    jest.spyOn(issueRepository, 'updateIssue').mockResolvedValue();
    jest.spyOn(issueRepository, 'getPendingIssueId').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'upsertAgent').mockResolvedValue();

    await expect(
      agentController.resolveIssue({
        id: '7a80fca8-2057-4467-b98a-b550085ab078',
        issueId: '27c1019b-5e1d-444b-b914-cc4d677be68e',
      }),
    ).resolves.toBe(undefined);
  });

  it('should resolve an issue and agent should be assigned to the pending issue', async () => {
    jest.spyOn(issueRepository, 'updateIssue').mockResolvedValue();
    jest
      .spyOn(issueRepository, 'getPendingIssueId')
      .mockResolvedValue('e05ca4c6-ce27-4c4e-a4e8-263c791eb0a0');
    jest.spyOn(agentRepository, 'upsertAgent').mockResolvedValue();

    await expect(
      agentController.resolveIssue({
        id: '7a80fca8-2057-4467-b98a-b550085ab078',
        issueId: '27c1019b-5e1d-444b-b914-cc4d677be68e',
      }),
    ).resolves.toBe(undefined);
  });

  it('should create an agent', async () => {
    jest.spyOn(issueRepository, 'updateIssue').mockResolvedValue();
    jest.spyOn(issueRepository, 'getPendingIssueId').mockResolvedValue(null);
    jest.spyOn(agentRepository, 'upsertAgent').mockResolvedValue();

    await expect(agentController.createAgent({ name: 'agent' })).resolves.toBe(
      undefined,
    );
  });

  it('should create an agent and agent should be assigned to the pending issue', async () => {
    jest.spyOn(issueRepository, 'updateIssue').mockResolvedValue();
    jest
      .spyOn(issueRepository, 'getPendingIssueId')
      .mockResolvedValue('e05ca4c6-ce27-4c4e-a4e8-263c791eb0a0');
    jest.spyOn(agentRepository, 'upsertAgent').mockResolvedValue();

    await expect(agentController.createAgent({ name: 'agent' })).resolves.toBe(
      undefined,
    );
  });
});
