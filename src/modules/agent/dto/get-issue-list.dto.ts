import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetIssueListDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
