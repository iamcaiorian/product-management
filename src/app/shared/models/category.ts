export interface Category {
    id: number;
    description: string;
    parentCategoryId?: number | null;
}