import { IsNotEmpty } from 'class-validator';

export class CreateAgentDto {
  @IsNotEmpty()
  name: string;
}
