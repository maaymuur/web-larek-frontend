import { Api, ApiListResponse } from "./base/api";
import { IOrder, ISuccessBuy, IProduct } from "../types";

export interface IApi{
    getListItems: () => Promise<IProduct[]>;
    getItem: (id:string) => Promise<IProduct>;
    orderItems: (order:IOrder) => Promise<ISuccessBuy>;
}

export class larekApi extends Api implements IApi{
    readonly cdn: string;

    constructor(cdn:string, baseUrl: string, opt?: RequestInit){
        super(baseUrl, opt);
        this.cdn = cdn;
    }

    getItem(id:string): Promise<IProduct>{
        return this.get(`/product/${id}`).then(
            (data:IProduct)=>({
                ...data,
                image:this.cdn+data.image
            })
        )
    }

    getListItems():Promise<IProduct[]>{
        return this.get(`/product`).then((data: ApiListResponse<IProduct>)=>
        data.items.map((item)=>({
            ...item,
            image:this.cdn +item.image
        }))
        )
    }

    orderItems(order: IOrder): Promise<ISuccessBuy> {
        return this.post(`/order`, order).then((data: ISuccessBuy) => {
            return data;
        });
    }    
}