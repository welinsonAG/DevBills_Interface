import type { Category } from "../types/Category";
import { api } from "./api";
import { TransactionType } from "../types/transactions";

export const getCategories = async (): Promise<Category[]> => {
    try{
const response = await api.get<Category[]>("/categories");

return response.data.map((category)=>({
    ...category,
    type: category.type.toUpperCase() as TransactionType,
}));

    } catch (err){
console.log(err)
throw new Error();
    }
};