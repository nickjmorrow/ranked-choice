import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { LIMITS } from '../limits';

/** Leading and trailing whitespace is never meaningful in a title or a label. */
const trim = () =>
  Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value));

export class CreateOptionDto {
  @trim()
  @IsString()
  @IsNotEmpty({ message: 'Every option needs a label.' })
  @MaxLength(LIMITS.optionLength)
  label: string;

  @trim()
  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.optionLength)
  sublabel?: string | null;
}

export class CreateQuestionDto {
  @trim()
  @IsString()
  @IsNotEmpty({ message: 'Every question needs a prompt.' })
  @MaxLength(LIMITS.questionLength)
  content: string;

  @trim()
  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.questionLength)
  subheading?: string | null;

  @IsArray()
  @ArrayMinSize(2, { message: 'Every question needs at least two options.' })
  @ArrayMaxSize(LIMITS.optionsPerQuestion)
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreatePollDto {
  @trim()
  @IsString()
  @IsNotEmpty({ message: 'The poll needs a title.' })
  @MaxLength(LIMITS.titleLength)
  title: string;

  @trim()
  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.descriptionLength)
  description?: string | null;

  @IsArray()
  @ArrayMinSize(1, { message: 'The poll needs at least one question.' })
  @ArrayMaxSize(LIMITS.questionsPerPoll)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class QuestionRankingDto {
  @IsInt()
  questionId: number;

  /** Most preferred first. Empty means the voter skipped the question. */
  @IsArray()
  @ArrayMaxSize(LIMITS.optionsPerQuestion)
  @IsInt({ each: true })
  optionIds: number[];
}

export class CastBallotDto {
  @IsArray()
  @ArrayMaxSize(LIMITS.questionsPerPoll)
  @ValidateNested({ each: true })
  @Type(() => QuestionRankingDto)
  rankings: QuestionRankingDto[];
}
