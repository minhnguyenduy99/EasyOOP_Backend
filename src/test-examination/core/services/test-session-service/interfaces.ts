export interface CreateSessionOptions {
    userId: string;
    testId: string;
}

export interface UpdateSessionOptions {
    testId: string;
}

export interface TestSession {
    countAnswer: number;
    userAnswers: { [sentenceId: string]: number };
    expired: number;
}

export interface ResultSession {
    userAnswers: any[];
}

export interface TestSentenceResult {
    user_answer: string;
    correct_answer: string;
}
