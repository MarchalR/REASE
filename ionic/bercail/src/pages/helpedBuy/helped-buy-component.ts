import {Component, ViewChild, Input} from '@angular/core';
import {Content, NavController} from 'ionic-angular';
import {HomeComponent} from '../home/home-component';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";
import {FormGroup} from "@angular/forms";
import {QuestionControlService} from "../../providers/questions/question-control.service";
import {QuestionBase} from "../../classes/question-base";
import {QuestionService} from "../../providers/questions/question.service";
import {TextboxQuestion} from "../../classes/question-textbox";
import {CodePostalQuestion} from "../../classes/question-cp";
import {DropdownQuestion} from "../../classes/question-dropdown";
import {RadioQuestion} from "../../classes/question-radio";
import {ListComponent} from "../list/list-component";
import {NumboxQuestion} from "../../classes/question-numbox";
import {EmptyQuestion} from "../../classes/question-empty";

@Component({
    selector: 'helped-buy-component',
    templateUrl: 'helped-buy-component.html'
})
export class HelpedBuyComponent {
    @ViewChild('input') myInput;
    @ViewChild(Content) content: Content;
    id = 0;
    homeComponent: any;
    form: FormGroup;
    questions: QuestionBase<any>[] = [];
    nextquestion: QuestionBase<any>;
    nextquestionValid: boolean = true;
    appartChecked = true;
    houseChecked = false;

    constructor(public navCtrl: NavController,
                public achatInfo: PreferencesProvider,
                public codePostaux: CodePostauxProvider,
                private service: QuestionService,
                private qcs: QuestionControlService) {
        this.homeComponent = HomeComponent;
        this.questions = this.service.getQuestions().slice();
    }

    ngOnInit(): void {
        this.nextquestion = new QuestionBase<any>();
        var q = this.service.getNextQuestion();
        if (q !== undefined) {
            this.nextquestion.key = q.key;
            this.nextquestion.label = q.label;
            this.nextquestion.controlType = q.controlType;
        } else {
            this.nextquestion.label = 'Vous avez rempli tous les champs disponibles.';
            this.nextquestionValid = false;
        }
        this.form = this.qcs.toFormGroup(this.questions);
    }

    onSubmit() {
        if (this.nextquestion.value !== undefined && this.nextquestion.value !== '')
            this.ok();
        for (var question of this.questions) {
            if (question.key !== "codePostal") {
                this.achatInfo[question.key] = question.value;
            }
        }
        this.navCtrl.push(ListComponent, {});
    }

    ok() {
        //supprime la question posé à la listes des questions.
        this.service.setAskedQuestion(this.nextquestion);
        var response;
        //en fonction du type de la question posé, crée la réponse
        switch (this.nextquestion.controlType) {
            case 'textbox': {
                response = new TextboxQuestion({
                    key: this.nextquestion.key,
                    label: this.nextquestion.label,
                    order: this.nextquestion.order,
                    symbole: this.nextquestion.symbole,
                    type: this.nextquestion.type,
                    value: this.nextquestion.value
                });
                break;
            }
            case 'numbox': {
                response = new NumboxQuestion({
                    key: this.nextquestion.key,
                    label: this.nextquestion.label,
                    order: this.nextquestion.order,
                    type: this.nextquestion.type,
                    symbole: this.nextquestion.symbole,
                    value: this.nextquestion.value
                });
                break;
            }
            case 'dropdown': {
                response = new DropdownQuestion({
                    key: this.nextquestion.key,
                    label: this.nextquestion.label,
                    order: this.nextquestion.order,
                    value: this.nextquestion.value
                });
                break;
            }
            case 'radio': {
                response = new RadioQuestion({
                    key: this.nextquestion.key,
                    label: this.nextquestion.label,
                    order: this.nextquestion.order,
                    value: this.nextquestion.value
                });
                break;
            }
            case 'codePostal': {
                response = new CodePostalQuestion({
                    key: this.nextquestion.key,
                    label: this.nextquestion.label,
                    order: this.nextquestion.order,
                    value: this.nextquestion.value
                });
                break;
            }
            case 'empty': {
                response = new EmptyQuestion({
                    key: this.nextquestion.key,
                    label: this.nextquestion.label,
                });
                break;
            }
        }
        if (response !== undefined)
            this.questions.push(response);
        Object.keys(this.form.controls).forEach(key => {
            for (let myControl of this.questions) {
                if (myControl.key === key)
                    myControl.value = this.form.get(key).value;
            }
        })
        this.form = this.qcs.toFormGroup(this.questions);

        //création de la prochaine question à poser.
        var t = this.service.getNextQuestion();
        if (t !== undefined) {
            this.nextquestion.key = t.key;
            this.nextquestion.label = t.label;
            this.nextquestion.controlType = t.controlType;
            this.nextquestion.type = t.type;
            this.nextquestion.symbole = t.symbole;
            this.nextquestion.value = '';
        } else {
            this.nextquestion.controlType = '';
            this.nextquestion.label = 'Vous avez rempli tous les champs disponibles.';
            this.nextquestionValid = false;
        }
        this.id++;
        //si un champ texte est affiché, ajoute le focus.
        if (this.myInput !== undefined){
            this.myInput.setFocus();
        }
        this.content.scrollToBottom();
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

    goBack() {
        //enregistre les questions posées
        this.service.setQuestion(this.questions);
        this.navCtrl.pop();
    }


}
