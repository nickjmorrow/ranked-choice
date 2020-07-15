export class PollResult {
    public questionResults: QuestionResult[];
}

class QuestionResult {
    public rounds: Round[];
    public options: Option[];
}

class Option {
    public optionId: number;
    public label: string;
    public sublabel: string | null;
}

class Round {
    public roundId: number;
    public optionResults: OptionResult[];
}

class OptionResult {
    public optionId: number;
    public voteCount: number;
}
