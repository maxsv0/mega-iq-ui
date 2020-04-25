import {Answer} from '@/_models/answer';

export class Rating {
    id: Answer["id"];
    score: number;
    comment: string;
    rated: boolean;
}