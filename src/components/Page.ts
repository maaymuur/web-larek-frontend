import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";
import { View } from "./Component";
import { IPageLarek } from "../types";

export class Page extends View<IPageLarek> {
    protected count: HTMLElement;
    protected catal: HTMLElement;
    protected wrap: HTMLElement;
    protected basket: HTMLElement;

    constructor(evt: EventEmitter , container: HTMLElement) {
        super(evt, container);

        this.count = ensureElement('.header__basket-counter');
        this.catal = ensureElement('.gallery');
        this.wrap = ensureElement('.page__wrapper');
        this.basket = ensureElement('.header__basket');

        this.basket.addEventListener('click', () => {
            this.evt.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.count, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this.catal.replaceChildren(...items);
    }

    set block(value: boolean) {
        if (!value) {
           this.toggleClass(this.wrap, 'page__wrapper_locked', value);
        } else {
            this.toggleClass(this.wrap, 'page__wrapper_locked');
        }
    }
}