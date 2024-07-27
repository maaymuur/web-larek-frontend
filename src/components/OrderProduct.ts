import { PaymentType, IOrder } from "../types";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { Form } from "./common/Form";

export class OrderProduct extends Form<IOrder> {
    card: HTMLButtonElement;
    cash: HTMLButtonElement;
    private _payment: PaymentType; 

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(events, container);

        this.card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
        this.cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
 
        this.card.addEventListener('click', () => {
            this.payment = 'card';
            this.onInputChange('payment', 'card');
        });
        
        this.cash.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
        });
        
    }

    set address(value: string) {
        const inputElement = this.container.querySelector<HTMLInputElement>('.address');
        if (inputElement) {
            inputElement.value = value;
        }
    }

    set payment(value: PaymentType) {
        this._payment = value; 
        this.toggleClass(this.card, 'button_alt-active', value === 'card');
        this.toggleClass(this.cash, 'button_alt-active', value === 'cash');
    }

    get payment(): PaymentType {
        return this._payment; 
    }

    set phone(value: string) {
        const phoneInput = this.container.querySelector<HTMLInputElement>('[name="phone"]');
        if (phoneInput) {
            phoneInput.value = value;
        }
    }

    set email(value: string) {
        const emailInput = this.container.querySelector<HTMLInputElement>('[name="email"]');
        if (emailInput) {
            emailInput.value = value;
        }
    }
}
