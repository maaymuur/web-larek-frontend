import { Component } from "./Component";
import { ensureElement } from "../utils/utils";
import { IActions, IProduct, Categories } from "../types";

export class ProductView extends Component<IProduct> {
    tit: HTMLElement;
    priceOfItem: HTMLElement;
    ind?: HTMLElement;
    img?: HTMLImageElement;
    descr?: HTMLElement;
    btn?: HTMLButtonElement;
    categor?: HTMLElement;

    constructor(container: HTMLElement, actions?:IActions){
        super(container);
    
        this.tit = ensureElement<HTMLElement>('.card__title', container);
        this.priceOfItem = ensureElement<HTMLElement>('.card__price', container);
        this.img = container.querySelector('.card__image');
        this.btn = container.querySelector('.card__button');
        this.descr = container.querySelector('.card__text');
        this.categor = container.querySelector('.card__category');
        this.ind = container.querySelector('.basket__item-index');
    
        if(actions?.onClick) {
            if(this.btn) {
                this.btn.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
      }

      disablePriceButton(value: number | null) {
        if(!value) {
            if(this.btn){
                this.btn.setAttribute('disabled', 'disabled');
            }
        }
    }
    
       set id(value: string) {
         this.container.dataset.id = value;
       }
    
       get id(): string {
        return this.container.dataset.id || '';
       }
    
       set title(value: string) {
        this.setText(this.tit, value);
       }
    
       get title(): string {
         return this.tit.textContent || '';
       }
    
       set price(value: number | null) {
        this.setText(this.priceOfItem, (value) ? `${value.toString()} синапсов` : 'Бесценно');
        this.disablePriceButton(value);
       }
    
       get price(): number {
         return Number(this.priceOfItem.textContent || '');
       }
    
       set category(value: string) {
        if (!this.categor) return;
        this.setText(this.categor, value);

        const categoryKey = value as keyof typeof Categories;
        const categoryClass = Categories[categoryKey];
        if (categoryClass) {
            this.categor.classList.add(categoryClass);
        } 
    }

    
       get category(): string {
          return this.categor.textContent || '';
       }
    
       set index(value: number) {
        this.setText(this.ind, value);
       }
    
       set image(value: string) {
        this.setImage(this.img, value, this.title);
       }
    
       set description(value: string) {
         this.setText(this.descr, value);
       }
    
       set btnTitle(value:string) {
        if(this.btn) {
          this.setText(this.btn, value);
        }
       }
    }
    

