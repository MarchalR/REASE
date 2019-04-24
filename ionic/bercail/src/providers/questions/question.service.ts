import {Injectable} from '@angular/core';

import {DropdownQuestion} from '../../classes/question-dropdown';
import {QuestionBase} from '../../classes/question-base';
import {TextboxQuestion} from '../../classes/question-textbox';
import {CodePostalQuestion} from "../../classes/question-cp";
import {NumboxQuestion} from "../../classes/question-numbox";
import {EmptyQuestion} from "../../classes/question-empty";

@Injectable()
export class QuestionService {

    private static orderedQuestions: QuestionBase<any>[] = [

        new EmptyQuestion({
            key: 'hello',
            label: 'Bonjour, je suis Rease votre assistant pour votre recherche immobilière. Appuyer sur le bouton \'Suivant\' pour continuer et sur \'Terminer\' pour lancer la recherche.',
            order: 1,
            importance: 102
        }),
        new CodePostalQuestion({
            key: 'codePostal',
            label: 'Veuillez sélectionner le ou les codes postaux correspondant à votre recherche.',
            order: 1,
            importance: 100
        }),
        new NumboxQuestion({
            key: 'pieces',
            label: 'Combien de pieces recherchez vous ?',
            type: 'number',
            order: 2,
            importance: 1
        }),
        new NumboxQuestion({
            key: 'prixMax',
            label: 'Quel est votre budget maximum ?',
            type: 'number',
            order: 2,
            symbole: '€',
            importance: 1
        }),
        new NumboxQuestion({
            key: 'supMin',
            label: 'Enfin, quelle est la superficie minimum de votre recherche ?',
            symbole: 'm²',
            type: 'number',
            order: 2,
            importance: 1
        })
    ];

    private static questions: QuestionBase<any>[] = [];

    getNextQuestion() {
        var importance = 0;
        var indexOfQ = -1;
        var toAskQuestion: QuestionBase<any>;
        for (var question of QuestionService.orderedQuestions){
            if (question !== undefined && question.importance > importance) {
                toAskQuestion = question;
                importance = question.importance;
                indexOfQ = QuestionService.orderedQuestions.indexOf(question);
            }
        }
        return toAskQuestion;
    }

    setAskedQuestion(Askedquestion: QuestionBase<any>) {
        for (var question of QuestionService.orderedQuestions) {
            if (question !== undefined && Askedquestion.key == question.key) {
                delete QuestionService.orderedQuestions[QuestionService.orderedQuestions.indexOf(question)];
            }
        }
    }

    getQuestions() {
        return QuestionService.questions;
    }

    public setQuestion(externquestions: QuestionBase<any>[]) {
        QuestionService.questions = externquestions.slice();
    }
}
