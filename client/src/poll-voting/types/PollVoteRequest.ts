export interface PollVoteRequest {
    link: string;
    questions: { questionId: number; options: { optionId: number; orderId: number }[] }[];
}
