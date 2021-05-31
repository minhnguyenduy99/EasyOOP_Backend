export interface CreateSessionOptions {
    testId: string;
}

export interface UpdateSessionOptions {
    testId: string;
}

export interface TestSession {
    sessionId: string;
    testId: string;
    countAnswer: number;
    userAnswers: { sentenceId: string; userAnswer: number }[];
    expired: number;
}

export interface ResultSession {
    userAnswers: any[];
}

export interface TestSentenceResult {
    user_answer: string;
    correct_answer: string;
}
