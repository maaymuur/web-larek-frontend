import { ensureElement, createElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { View } from "./Component";
import { IBasket } from "../types";

export class Basket extends View<IBasket> {
    list: HTMLElement;
    totalItems: HTMLElement;
    btn: HTMLButtonElement;

    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(events, container);
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalItems = ensureElement<HTMLElement>('.basket__price', this.container);
        this.btn = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        if(this.btn){
            this.btn.addEventListener('click', ()=> {
                events.emit('order:open');
            });
        }
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.list.replaceChildren(...items);
            if (this.btn) {
                this.btn.removeAttribute('disabled');
            }
        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            if (this.btn) {
                this.btn.setAttribute('disabled', 'disabled');
            }
        }
    }

    set total(total: number) {
        this.setText(this.totalItems,(total)?  `${String(total)} синапсов` : '');
    }

}