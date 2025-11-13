
import { useEffect, useState } from "react";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMonthy, getTransactionsSummay } from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import Card from "../components/Card";
import { AArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type PieLabelRenderProps } from "recharts";

const initialSummary: TransactionSummary = {
  balance: 0,
  totalExpenses: 0,
  totalIcomes: 0,
  expensesByCategory: [],
};


const Dashboard = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [monthyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionsSummay(month, year);
      console.log("📊 RESUMO RECEBIDO:", response);
      setSummary(response);
    }
    loadTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthy() {
      const response = await getTransactionsMonthy(month, year, 4);
      console.log(response);
      setMonthlyItemsData(response.history);
    }
    loadTransactionsMonthy();
  }, [month, year]);

  const handleMonthChange = (m: number) => setMonth(m);
  const handleYearChange = (y: number) => setYear(y);

const renderPieChartLabel = (props: PieLabelRenderProps) => {
  const { name, percent } = props;
  const pct = Number(percent ?? 0);
  return `${name}: ${(pct * 100).toFixed(0)}%`;
};

  const formatTooltipValue = (value: number): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };



  // ✅ Mapeia dados para o formato esperado pelo Recharts
  const pieData = (summary.expensesByCategory ?? []).map((item) => ({
    name: item.categoryName,
    value: item.amount,
    categoryId: item.categoryId,
    fill: item.categoryColor,
  }));

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
        <Card icon={<Wallet size={20} className="text-primary-500" />} title="Saldo" hover>
          <p
            className={`text-2xl font-semibold mt-2 ${summary.balance > 0 ? "text-primary-500" : "text-red-300"
              }`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card icon={<AArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className="text-2xl font-semibold mt-2 text-primary-500">
            {formatCurrency(summary.totalIcomes)}
          </p>
        </Card>

        <Card icon={<Wallet size={20} className="text-red-600" />} title="Despesas" hover>
          <p className="text-2xl font-semibold mt-2 text-red-700">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">



        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por Categoria"
          className="min-h-80"
          hover
        >
          {pieData.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={renderPieChartLabel}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Nenhuma despesa registrada nesse período
            </div>
          )}
        </Card>

<Card icon={<Calendar size={20} className="text-primary-500" />} title="Histórico Mensal" className="min-h-80 p-2.5" hover>
  <div className="h-72 mt-4">
    {monthyItemsData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthyItemsData} margin={{left: 40}}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255,0.1)"/>
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ style: {textTransform: "capitalize"}}}/>
          <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} tick={{style: {fontSize: 14}}}/>
          <Tooltip formatter={formatCurrency} contentStyle={{backgroundColor: "#1a1a1a", borderColor:"#2a2a2a",}} labelStyle={{color:"#f8f8f8"}}/>
          <Legend />
          <Bar dataKey="expenses" name="Despesas" fill="#ff6384" />
          <Bar dataKey="income"  name="Receitas" fill="#37e359" />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum despesa registrada para esse período
      </div>
    )}
  </div>
</Card>
      </div>

    </div>
  )
}

export default Dashboard;
