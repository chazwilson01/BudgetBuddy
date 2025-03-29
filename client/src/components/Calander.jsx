import { useState, useEffect } from "react";
import { useUser } from "../contexts/Context";
import "./BudgetProgress.css"
const Calendar = () => {
  const [dailySpending, setDailySpending] = useState({});
  const [maxDailySpend, setMaxDailySpend] = useState(0);
  
  const { transactions } = useUser();
  // Get current month info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get the day of week for the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Calculate daily spending
  useEffect(() => {
    if (transactions && transactions.transactionsByCategory) {
      const spending = {};
      let maxSpend = 0;
      
      // Flatten all transactions into a single array
      const allTransactions = Object.values(transactions.transactionsByCategory || {})
        .flat()
        .filter(t => t && t.date); // Ensure transaction has a date
      
      // Group transactions by date and sum amounts
      allTransactions.forEach(transaction => {
        const date = transaction.date.split('T')[0]; // Handle ISO date format if needed
        const amount = Math.abs(transaction.amount || 0); // Use absolute value for spending
        
        if (!spending[date]) {
          spending[date] = 0;
        }
        spending[date] += amount;
        
        // Track maximum daily spending for scaling the heatmap
        if (spending[date] > maxSpend) {
          maxSpend = spending[date];
        }
      });
      
      setDailySpending(spending);
      setMaxDailySpend(maxSpend);
    }
  }, [transactions]);
  
  // Get heatmap color based on spending amount with improved contrast
  const getHeatmapColor = (amount) => {
    if (!amount) return 'bg-gray-100';
    
    // Calculate intensity as percentage of max spending
    const intensity = Math.min(Math.ceil((amount / maxDailySpend) * 100), 100);
    
    // Improved color scale with better contrast
    if (intensity < 10) return 'bg-blue-50';
    if (intensity < 20) return 'bg-blue-100';
    if (intensity < 30) return 'bg-blue-200';
    if (intensity < 40) return 'bg-blue-300';
    if (intensity < 50) return 'bg-blue-400';
    if (intensity < 60) return 'bg-blue-500';
    if (intensity < 70) return 'bg-blue-600';
    if (intensity < 80) return 'bg-blue-700';
    if (intensity < 90) return 'bg-blue-800';
    return 'bg-blue-900';
  };
  
  // Get appropriate text color based on background intensity
  const getTextColor = (amount) => {
    if (!amount) return 'text-blue-900';
    
    const intensity = Math.min(Math.ceil((amount / maxDailySpend) * 100), 100);
    
    // Lighter text for darker backgrounds
    if (intensity >= 50) return 'text-white';
    // Darker text for lighter backgrounds
    return 'text-blue-900';
  };
  
  // Format currency - more compact for small screens
  const formatCurrency = (amount, compact = false) => {
    if (compact && amount >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Generate calendar days array
  const generateCalendarDays = () => {
    const days = [];
    const monthYear = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${monthYear}-${String(i).padStart(2, '0')}`;
      const spending = dailySpending[dateStr] || 0;
      days.push({
        day: i,
        date: dateStr,
        spending
      });
    }
    
    return days;
  };
  
  const days = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Shorter labels for mobile
  
  return (
    <div className="fade-in bg-white rounded-lg shadow p-3 sm:p-6 mx-auto border border-blue-100 h-full flex flex-col justify-center w-full max-w-lg">
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-blue-800">Monthly Spending Heatmap</h2>
      <p className="text-xs sm:text-sm text-blue-600 mb-3 sm:mb-6 hidden sm:block">
        See your daily spending patterns with darker colors indicating higher spending
      </p>
      
      {/* Weekday labels - responsive */}
      <div className="mb-2 sm:mb-4 grid grid-cols-7 gap-0.5 sm:gap-1">
        {weekdays.map((day, index) => (
          <div key={day} className="text-center text-xs font-medium text-blue-700">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{weekdaysShort[index]}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid - responsive */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`aspect-square ${day ? getHeatmapColor(day.spending) : 'bg-transparent'} rounded p-0.5 sm:p-1 relative`}
          >
            {day && (
              <div className="h-full w-full flex flex-col">
                <div className={`text-xs font-medium ${getTextColor(day.spending)}`}>
                  {day.day}
                </div>
                {day.spending > 0 && (
                  <div className={`text-xs mt-auto font-medium ${getTextColor(day.spending)} truncate`}>
                    {formatCurrency(day.spending, window.innerWidth < 640)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Spending scale - responsive */}
      <div className="mt-4 sm:mt-6 border-t border-blue-200 pt-2 sm:pt-4">
        <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-blue-800">Spending Scale</p>
        <div className="flex items-center justify-center">
          <div className="mr-1 sm:mr-2 text-xs text-blue-700">
            <span>$0</span>
          </div>

          <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-blue-50 to-blue-900 rounded"></div>
          
          <div className="ml-1 sm:ml-2 text-xs text-blue-700">
            <span>{formatCurrency(maxDailySpend, window.innerWidth < 640)}</span>
          </div>
        </div>
      </div>

      {/* Legend - hide on smallest screens */}
      <div className="mt-3 sm:mt-4 text-xs text-gray-600">
        <p className="font-medium text-blue-800 mb-1 hidden sm:block">Color Guide:</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 mr-1 rounded"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 mr-1 rounded"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 mr-1 rounded"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center hidden sm:flex">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-700 mr-1 rounded"></div>
            <span className="text-xs">Very High</span>
          </div>
          <div className="flex items-center hidden sm:flex">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-900 mr-1 rounded"></div>
            <span className="text-xs">Maximum</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;