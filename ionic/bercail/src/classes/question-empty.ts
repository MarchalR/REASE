import { QuestionBase } from './question-base';

export class EmptyQuestion extends QuestionBase<string> {
  controlType = 'empty';
  type: string;

  constructor(options: {} = {}) {
    super(options);
  }
}
