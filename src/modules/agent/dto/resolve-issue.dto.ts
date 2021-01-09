import { IsNotEmpty, IsUUID } from 'class-validator';

export class ResolveIssueDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  issueId: string;
}
