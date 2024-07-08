import { EventEmitter } from "./base/events";

export class Component<T>{
    constructor(protected readonly container: HTMLElement){

    }

    toggleClass(el: HTMLElement, className:string, force?:boolean){
        el.classList.toggle(className, force)
    }

    setText(el: HTMLElement, value: unknown){
        if(el){
            el.textContent = String(value);
        }
    }

    setImage(el:HTMLImageElement, src:string, alt:string){
        if(el){
            el.src = src;
            if(alt){
                el.alt = alt;
            }
        }
    }


    render(data?:T):HTMLElement{
        Object.assign(this as object, data ?? {});
        return this.container;
    }

}

export class View<T> extends Component<T>{
    constructor(protected readonly evt:EventEmitter, container:HTMLElement){
        super(container)
    }
}