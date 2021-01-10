import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AgentStatus } from 'modules/agent/agent.enum';
import { AgentRepository } from 'modules/agent/agent.repository';
import { IssueStatus } from './issue.enum';
import { IssueRepository } from './issue.repository';
import { IssueService } from './issue.service';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
}));

describe('IssueService', () => {
  let issueService: IssueService;
  let agentRepository: AgentRepository;
  let issueRepository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentRepository, IssueRepository, IssueService],
    }).compile();

    issueService = module.get<IssueService>(IssueService);
    agentRepository = module.get<AgentRepository>(AgentRepository);
    issueRepository = module.get<IssueRepository>(IssueRepository);
  });

  it('should create a new issue', async () => {
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(issueRepository, 'save').mockResolvedValue({
      id: '5361b545-11c4-45c4-bc81-edd2dc1eb36b',
      status: IssueStatus.PENDING,
      title: 'issue 1',
    });

    await expect(
      issueService.createIssue({
        title: 'issue 1',
      }),
    ).resolves.toBe(undefined);
  });

  it('should throw an error if issue with the same title already exists', async () => {
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue({
      id: '5361b545-11c4-45c4-bc81-edd2dc1eb36b',
      status: IssueStatus.PENDING,
      title: 'issue 1',
    });

    await expect(
      issueService.createIssue({
        title: 'issue 1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a new issue and assign it to an available agent', async () => {
    jest.spyOn(agentRepository, 'findOne').mockResolvedValue({
      id: 'deeafc46-d1e7-4c2d-afd6-1b00590706b4',
      name: 'Agent 1',
      status: AgentStatus.AVAILABLE,
    });
    jest.spyOn(agentRepository, 'save').mockResolvedValue({
      id: 'deeafc46-d1e7-4c2d-afd6-1b00590706b4',
      name: 'Agent 1',
      status: AgentStatus.ASSIGNED,
    });
    jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(issueRepository, 'save').mockResolvedValue({
      id: '21027750-5fca-444c-bdf1-75aa3d5da119',
      title: 'issue 1',
      status: IssueStatus.ASSIGNED,
    });

    await expect(
      issueService.createIssue({
        title: 'issue 1',
      }),
    ).resolves.toBe(undefined);
  });
});
