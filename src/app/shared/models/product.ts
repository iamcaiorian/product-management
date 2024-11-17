import { Category } from "./category";

export interface Product {
    id: string;
    code: string;
    description: string;
    promotionalPrice?: number | null;
    onPromotion: boolean | null;
    stockQuantity?: number | null;
    status: boolean;
    title: string;
    price: number;
    categories: Category[];
    reference: string;
    isHighlighted?: boolean | null;
    topImage: string;
}
  