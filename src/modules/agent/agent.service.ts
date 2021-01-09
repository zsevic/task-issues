import { Injectable } from '@nestjs/common';
import { AgentRepository } from './agent.repository';

@Injectable()
export class AgentService {
  constructor(private readonly agentRepository: AgentRepository) {}
}
