import { QuestionBase } from './question-base';

export class NumboxQuestion extends QuestionBase<string> {
  controlType = 'numbox';
  type: string
  symbole: string

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.symbole = options['symbole'] || '';
  }
}
