import type { Category, categorySummary } from "./Category";

export enum TransactionType{
    EXPENSE = 'expense',
    INCOME=  'income',


}
export  interface Transaction{
    id: string;
    userId: string;
    description: string;
    amount:number;
    date: string | Date;
    categoryId: string;
    category: Category;
    type: TransactionType;
    updatedAt: string | Date;
    createdAt: string | Date;
}


export interface TransactionFilter {
    month: number;
    year: number;
    category?: string;
    type?: TransactionType;
}


  export interface TransactionSummary{
    totalExpenses: number;
    totalIcomes: number;
    balance: number;
    expensesByCategory: categorySummary[];
  }

  export interface MonthlyItem{
   name: string;
   expenses: number;
   income: number;
  }