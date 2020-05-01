import {TestResult} from '@/_models/test-result';

export interface Rating {
    test: TestResult["code"];
    question: number;
    score: number;
    comment: string;
}