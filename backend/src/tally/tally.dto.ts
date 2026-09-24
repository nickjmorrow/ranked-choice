import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { LIMITS } from '../limits';

export class BallotDto {
  @IsArray()
  @ArrayMaxSize(LIMITS.optionsPerQuestion)
  @IsInt({ each: true })
  ranking: number[];

  @IsInt()
  @Min(0)
  @Max(LIMITS.votersPerBallotGroup)
  count: number;
}

/** A count of hypothetical ballots — the simulator's request. Nothing is stored. */
export class TallyRequestDto {
  @IsArray()
  @ArrayMaxSize(LIMITS.optionsPerQuestion)
  @IsInt({ each: true })
  optionIds: number[];

  @IsArray()
  @ArrayMaxSize(LIMITS.ballotGroups)
  @ValidateNested({ each: true })
  @Type(() => BallotDto)
  ballots: BallotDto[];
}
