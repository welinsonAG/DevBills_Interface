/* eslint-disable @typescript-eslint/no-unused-vars */


import { useEffect, useState } from "react";

import MonthYearSelect from "../components/MonthYearSelect";

import { getTransactions, getTransactionsSummay } from "../services/transactionService";
import type { TransactionSummary } from "../types/transactions";
import Card from "../components/Card";
import { AArrowUp, TrendingUp, Wallet } from 'lucide-react'
import { formatCurrency } from "../utils/formatters";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';


const initialSummary: TransactionSummary = {
  balance: 0,
  totalExpenses: 0,
  totalIcomes: 0,
  expensesByCategory: [],
};

interface ChartLabelProps {
  categoryName: string;
  percent: number;
}


const Dashboard = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);

  useEffect(() => {
    async function loadTransactionsSummary() {

      const response = await getTransactionsSummay(month, year)
      console.log("📊 RESUMO RECEBIDO:",response);

      setSummary(response)



    }

    loadTransactionsSummary();
  }, [month, year]); // 👈 Atualiza sempre que mês/ano mudam


  const handleMonthChange = (m: number) => setMonth(m);
  const handleYearChange = (y: number) => setYear(y);

  const renderPieChartLabel =  ({categoryName,percent}: ChartLabelProps): string => {
    return `${categoryName}: ${(percent * 100).toFixed(1)}%`;
  }
    const formatTooltipValue = (value: number): string => {
    return formatCurrency(typeof value === 'number' ? value : 0);
  }
    
  
  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl mb-4 md:mb-0">Dashboard</h1>

        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card icon={<Wallet size={20} className='text-primary-500' />} title="Saldo" hover
        >
          <div>
            <p className={`text-2xl font-semibold mt-2 ${summary.balance > 0 ? 'text-primary-500' : 'text-red-300'}`}>{formatCurrency(summary.balance)}</p>
          </div>
        </Card>

        <Card icon={<AArrowUp size={20} className='text-primary-500' />} title="Receitas" hover
        >
          <div>
            <p className='text-2xl font-semibold mt-2 text-primary-500'>{formatCurrency(summary.totalIcomes)}</p>
          </div>
        </Card>

        <Card icon={<Wallet size={20} className='text-red-600' />} title="Despesas" hover
        >
          <div>
            <p className='text-2xl font-semibold mt-2 text-red-700'>{formatCurrency(summary.totalExpenses)}</p>
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card icon={< TrendingUp size={20} className='text-primary-500'/>}

          title="Despesas por Categoria" className="min-h-80" hover>

       {(summary.expensesByCategory ?? []).length > 0 ? (
            <div className="h-72 mt-4"> 
          <ResponsiveContainer width={'100%'} height={300}>
            <PieChart>
              <Pie data={summary.expensesByCategory}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="amount"
                nameKey="categoryName"
                label={renderPieChartLabel}
              
              >
                {summary.expensesByCategory.map((entry) => (
                  <Cell key={entry.categoryId} fill={entry.categoryColor} />
                ))}

              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </div>
           ) : (
            <div className="flex items-center justify-center h-64 text-gray-500"> 
           Nenhuma despesa registrad nesse período
           </div>

           )}
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
