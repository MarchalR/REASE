import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionBase} from '../../classes/question-base';
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";
import {PreferencesProvider} from "../../providers/preferences/preferences";

@Component({
  selector: 'app-question',
  templateUrl: './form-question.component.html'
})
export class FormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() appartChecked: boolean;
  @Input() houseChecked: boolean;
    constructor(public achatInfo: PreferencesProvider,
                public codePostaux: CodePostauxProvider) {
    }

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
    houseClick() {
        if (!this.appartChecked && !this.houseChecked) {
            this.appartChecked = true;
        }
    }
    appartClick() {
        if (!this.appartChecked && !this.houseChecked) {
            this.houseChecked = true;
        }
    }
}
