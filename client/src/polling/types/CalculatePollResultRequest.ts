export interface CalculatePollResultRequest {
    poll: {
        questions: {
            optionIds: number[];
            votes: {
                rankedOptions: {
                    orderId: number;
                    optionId: number;
                }[];
            }[];
        }[];
    };
}
