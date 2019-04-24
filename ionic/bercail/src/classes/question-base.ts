export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    importance: number;
    followedBy: string;
    type: string;
    symbole: string;
    controlType: string;

    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        order?: number,
        type?: string,
        symbole?: string,
        controlType?: string,
        importance?: number,
        followedBy?: string
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.type = options.type || '';
        this.symbole = options.symbole || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.importance = options.importance || 0;
        this.followedBy = options.followedBy || '';
    }
}
