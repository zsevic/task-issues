import { Test, TestingModule } from '@nestjs/testing';
import { AgentRepository } from 'modules/agent/agent.repository';
import { Issue } from './dto';
import { IssueController } from './issue.controller';
import { IssueStatus } from './issue.enum';
import { IssueRepository } from './issue.repository';
import { IssueService } from './issue.service';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
}));

describe('IssueController', () => {
  let issueController: IssueController;
  let agentRepository: AgentRepository;
  let issueRepository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueController],
      providers: [AgentRepository, IssueRepository, IssueService],
    }).compile();

    issueController = module.get<IssueController>(IssueController);
    agentRepository = module.get<AgentRepository>(AgentRepository);
    issueRepository = module.get<IssueRepository>(IssueRepository);
  });

  it('should return issue list', async () => {
    const result: Issue[] = [
      {
        id: 'f2403062-7ca9-49b5-911d-4f8ec654e4c3',
        agent_id: null,
        title: 'issue 1',
        status: IssueStatus.PENDING,
      },
    ];
    jest.spyOn(issueRepository, 'getIssueList').mockResolvedValue(result);

    const issueList: Issue[] = await issueController.getIssueList();

    expect(issueList).toBe(result);
  });

  it('should create a pending issue', async () => {
    jest.spyOn(agentRepository, 'getAvailableAgentId').mockResolvedValue(null);
    jest.spyOn(issueRepository, 'createIssue').mockResolvedValue();

    await expect(
      issueController.createIssue({ title: 'issue 1' }),
    ).resolves.toBe(undefined);
  });

  it('should create an issue and assign it to an available agent', async () => {
    jest
      .spyOn(agentRepository, 'getAvailableAgentId')
      .mockResolvedValue('2e019243-f456-4b98-9ce2-9601d32ba330');
    jest.spyOn(agentRepository, 'upsertAgent').mockResolvedValue();
    jest.spyOn(issueRepository, 'createIssue').mockResolvedValue();

    await expect(
      issueController.createIssue({ title: 'issue 1' }),
    ).resolves.toBe(undefined);
  });
});
