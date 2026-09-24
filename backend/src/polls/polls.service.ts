import { randomInt } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, type EntityManager, In } from 'typeorm';
import { type Ballot, tally } from '../tally/tally';
import { Option } from './option.entity';
import { Poll } from './poll.entity';
import type { CastBallotDto, CreatePollDto } from './polls.dto';
import type { CreatedPollView, PollResultsView, PollView } from './polls.views';
import { Question } from './question.entity';
import { Vote } from './vote.entity';

/** Lowercase letters and digits minus the ones that read alike (0/o, 1/l/i). */
const LINK_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const LINK_LENGTH = 10;

@Injectable()
export class PollsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(request: CreatePollDto): Promise<CreatedPollView> {
    for (const question of request.questions) {
      const labels = question.options.map((option) => option.label.toLowerCase());
      if (new Set(labels).size !== labels.length) {
        throw new BadRequestException(
          `Options must be distinct within a question; “${question.content}” repeats one.`,
        );
      }
    }

    // One transaction: a failure part-way leaves no half-created poll behind.
    return this.dataSource.transaction(async (manager) => {
      const link = await this.unusedLink(manager);
      const poll = await manager.save(
        manager.create(Poll, {
          title: request.title,
          description: emptyToNull(request.description),
          link,
        }),
      );

      for (const [index, question] of request.questions.entries()) {
        const saved = await manager.save(
          manager.create(Question, {
            pollId: poll.pollId,
            orderId: index + 1,
            content: question.content,
            subheading: emptyToNull(question.subheading),
            isRequired: true,
          }),
        );
        await manager.insert(
          Option,
          question.options.map((option) => ({
            questionId: saved.questionId,
            label: option.label,
            sublabel: emptyToNull(option.sublabel),
          })),
        );
      }

      return { link };
    });
  }

  async get(link: string): Promise<PollView> {
    return toView(await this.findPoll(this.dataSource.manager, link));
  }

  async castBallot(link: string, request: CastBallotDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const poll = await this.findPoll(manager, link);
      const votes = validBallot(poll, request);

      // A sequence, not max(submission_id) + 1: two ballots arriving together
      // would read the same max and be merged into one.
      const [{ id }] = await manager.query<[{ id: number }]>(
        `select nextval('ballot_submission_seq')::int as id`,
      );
      await manager.insert(
        Vote,
        votes.map((vote) => ({ ...vote, submissionId: id })),
      );
    });
  }

  async results(link: string): Promise<PollResultsView> {
    const manager = this.dataSource.manager;
    const poll = await this.findPoll(manager, link);
    const questionIds = poll.questions.map((question) => question.questionId);
    const votes =
      questionIds.length === 0
        ? []
        : await manager.find(Vote, {
            where: { questionId: In(questionIds) },
            order: { submissionId: 'ASC', orderId: 'ASC' },
          });

    return {
      poll: toView(poll),
      ballots: new Set(votes.map((vote) => vote.submissionId)).size,
      questions: poll.questions.map((question) => ({
        questionId: question.questionId,
        tally: tally(
          question.options.map((option) => option.optionId),
          ballotsFor(votes.filter((vote) => vote.questionId === question.questionId)),
        ),
      })),
    };
  }

  private async findPoll(manager: EntityManager, link: string): Promise<Poll> {
    const poll = await manager.findOne(Poll, {
      where: { link },
      relations: { questions: { options: true } },
      order: { questions: { orderId: 'ASC', options: { optionId: 'ASC' } } },
    });
    if (poll === null) throw new NotFoundException('No poll has that link.');
    return poll;
  }

  private async unusedLink(manager: EntityManager): Promise<string> {
    // 31^10 possibilities: a collision is not expected, but the unique index
    // would turn one into a failed request, so check rather than hope.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const link = Array.from(
        { length: LINK_LENGTH },
        () => LINK_ALPHABET[randomInt(LINK_ALPHABET.length)],
      ).join('');
      if (!(await manager.exists(Poll, { where: { link } }))) return link;
    }
    throw new Error('Could not find an unused poll link.');
  }
}

/**
 * The rows to insert for a ballot, or a 400 saying what is wrong with it. The
 * ids come from the client, so each one is checked against this poll — a vote
 * for another poll's option would otherwise be stored, and break the count of
 * every question it touched.
 */
function validBallot(poll: Poll, request: CastBallotDto): Omit<Vote, 'voteId' | 'submissionId'>[] {
  const questions = new Map(poll.questions.map((question) => [question.questionId, question]));
  const seen = new Set<number>();
  const rows: Omit<Vote, 'voteId' | 'submissionId'>[] = [];

  for (const ranking of request.rankings) {
    const question = questions.get(ranking.questionId);
    if (question === undefined) {
      throw new BadRequestException('The ballot answers a question that is not on this poll.');
    }
    if (seen.has(ranking.questionId)) {
      throw new BadRequestException('The ballot answers the same question twice.');
    }
    seen.add(ranking.questionId);

    const optionIds = new Set(question.options.map((option) => option.optionId));
    if (ranking.optionIds.some((id) => !optionIds.has(id))) {
      throw new BadRequestException(
        `The ballot ranks an option that is not on “${question.content}”.`,
      );
    }
    if (new Set(ranking.optionIds).size !== ranking.optionIds.length) {
      throw new BadRequestException(`The ballot ranks an option twice on “${question.content}”.`);
    }

    for (const [index, optionId] of ranking.optionIds.entries()) {
      rows.push({ questionId: question.questionId, optionId, orderId: index + 1 });
    }
  }

  for (const question of poll.questions) {
    const answered = rows.some((row) => row.questionId === question.questionId);
    if (question.isRequired && !answered) {
      throw new BadRequestException(`Rank at least one option for “${question.content}”.`);
    }
  }
  if (rows.length === 0) throw new BadRequestException('The ballot is empty.');

  return rows;
}

/** One question's votes as ballots, identical rankings grouped. */
function ballotsFor(votes: Vote[]): Ballot[] {
  const rankings = new Map<number, number[]>();
  for (const vote of votes) {
    const ranking = rankings.get(vote.submissionId) ?? [];
    ranking.push(vote.optionId);
    rankings.set(vote.submissionId, ranking);
  }

  const groups = new Map<string, Ballot>();
  for (const ranking of rankings.values()) {
    const key = ranking.join(',');
    const group = groups.get(key);
    if (group === undefined) groups.set(key, { ranking, count: 1 });
    else group.count += 1;
  }
  return [...groups.values()];
}

function toView(poll: Poll): PollView {
  return {
    link: poll.link,
    title: poll.title,
    description: poll.description,
    questions: poll.questions.map((question) => ({
      questionId: question.questionId,
      content: question.content,
      subheading: question.subheading,
      isRequired: question.isRequired,
      options: question.options.map((option) => ({
        optionId: option.optionId,
        label: option.label,
        sublabel: option.sublabel,
      })),
    })),
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  return value === undefined || value === null || value === '' ? null : value;
}
