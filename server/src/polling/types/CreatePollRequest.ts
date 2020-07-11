export interface CreatePollRequest {
    poll: {
        title: string;
        description: string;
        link: string;
        questions: {
            questionId: number;
            orderId: number;
            content: string;
            subheading: string;
            isRequired: boolean;
            options: {
                optionId: number;
                label: string;
                sublabel: string | null;
            }[];
        }[];
    };
}
