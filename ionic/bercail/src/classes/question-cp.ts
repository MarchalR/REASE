import { QuestionBase } from './question-base';

export class CodePostalQuestion extends QuestionBase<string> {
  controlType = 'codePostal';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
