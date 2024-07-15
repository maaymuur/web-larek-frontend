import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { View } from "../Component";

export interface IModal{
    content:HTMLElement;
}

export class Modal extends View<IModal>{
    _closeBtn: HTMLButtonElement;
    _content: HTMLElement;

    constructor(container: HTMLElement, evt:EventEmitter){
        super(evt, container)

        this._closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container)
        this._content = ensureElement<HTMLElement>('.modal__content', container)

        this._closeBtn.addEventListener('click', this.close.bind(this))
        this.container.addEventListener('click', this.close.bind(this))
        this._content.addEventListener('click', (evt) => evt.stopPropagation())
    }


    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }


    open(){
        document.addEventListener('keydown', this.Escape)
        this.container.classList.add('modal_active');
        this.evt.emit('modal:open');
    }

    close(){
        document.addEventListener('keydown', this.Escape)
        this.container.classList.remove('modal_active')
        this.content = null;
        this.evt.emit('modal:close');
    }

    Escape = (evt: KeyboardEvent) =>{
        if(evt.key === 'Escape') {
            this.close();
        }
    }

    render(data: IModal):HTMLElement{
        super.render(data);
        this.open();
        return this.container;
    }
}