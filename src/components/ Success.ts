import { ISuccessBuy } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./Component";
import { EventEmitter } from "./base/events";

export class Success extends Component<ISuccessBuy> {
    total: HTMLElement;
    evt: EventEmitter;
    close: HTMLElement;
    
    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.evt = events;
        this.close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this.total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.close.addEventListener('click', () => {
            this.evt.emit('order:result');
        })
    }

    set summ(value: number) {
        this.setText(this.total, `Списано ${String(value)} синапсов`);
    }
}