import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const monthNames: readonly string[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MonthYearSelect = ({ month, year, onMonthChange, onYearChange }: MonthYearSelectProps) => {
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleNextMonth = ():void =>{
     if(month === 12){
      onMonthChange(1)
      onYearChange(year + 1)
     }else{
      onMonthChange(month + 1)
     }
  }

    const handlePrevMonth = ():void =>{
   if(month === 1){
      onMonthChange(12)
      onYearChange(year - 1)
     }else{
      onMonthChange(month - 1)
     }
  }

  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700">
      {/* Botão mês anterior */}
      <button
        type="button"
        
        className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Mês anterior"
        onClick={handlePrevMonth}
      >
        <ChevronLeft />
      </button>

      {/* Selects de mês e ano */}
      <div className="flex gap-3">
        <select
          id="month-select"
          value={month}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <select
          id="year-select"
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Botão próximo mês */}
      <button
        type="button"
       
        className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Próximo mês"
        onClick={handleNextMonth}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthYearSelect;
