import { View } from "../Component";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IForm{
    valid:boolean;
    errors:string[];
    payment?: string; 
    address?: string; 
    email?: string,
    phone?: string,
}

export class Form<T> extends View<IForm>{
    _btn:HTMLButtonElement;
    _err: HTMLElement;

    constructor(evt:EventEmitter, container: HTMLFormElement) {
        super(evt, container);

        this._btn = ensureElement<HTMLButtonElement>('button[type=submit]', this.container)
        this._err = ensureElement<HTMLElement>('#form__errors', this.container)

        this.container.addEventListener('input', (e:Event)=>{
            const target = e.target as HTMLInputElement;
            const input = target.name as keyof T;
            const value = target.value;
            this.onInputChange(input, value);
        })

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.evt.emit(`${this.container.className}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.evt.emit(`${this.container.className}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
       this._btn.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._err, value);
    }

    render(state: Partial<T> & IForm) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}


