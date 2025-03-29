import { useUser } from "../contexts/Context";
import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, PieChart, Download, ChevronDown, Sliders } from "lucide-react";

const RecentTransactions = () => {
  const { transactions } = useUser();
  const sampleData = transactions.transactionsByCategory;
  
  // States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("last30");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [month, setMonth] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    console.log(sampleData);
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' });

    setMonth(month);

    // Set up event listener for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Function to format currency - displays absolute values (no negative signs)
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount));
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (windowWidth < 480) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Create an "all" transactions array by combining all categories
  const allTransactions = Object.values(sampleData).flat();
  
  // Get categories with transaction counts, including an "all" option
  const categories = [
    {
      name: "all",
      count: allTransactions.length,
      total: allTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    },
    ...Object.keys(sampleData).map(category => ({
      name: category,
      count: sampleData[category].length,
      total: sampleData[category].reduce((sum, tx) => sum + tx.amount, 0)
    }))
  ];
  
  // Get transactions for the selected category
  const categoryTransactions = selectedCategory === "all" 
    ? allTransactions 
    : sampleData[selectedCategory];
  
  // Filter transactions based on search and date range
  const filteredTransactions = categoryTransactions.filter(tx => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      tx.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (dateRange === "last7") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = new Date(tx.date) >= sevenDaysAgo;
    } else if (dateRange === "last30") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      matchesDate = new Date(tx.date) >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesDate;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOrder === "highest") {
      return Math.abs(b.amount) - Math.abs(a.amount);
    } else if (sortOrder === "lowest") {
      return Math.abs(a.amount) - Math.abs(b.amount);
    }
    return 0;
  });
  
  // Calculate analytics
  const categoryTotal = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const averageTransaction = filteredTransactions.length > 0 
    ? categoryTotal / filteredTransactions.length 
    : 0;
    
  // Determine if we should show the grid or dropdown based on screen width
  const isSmallScreen = windowWidth < 768;
  const isMobileScreen = windowWidth < 480;
  
  // Get the display name for the current category
  const getCurrentCategoryDisplayName = () => {
    const category = categories.find(c => c.name === selectedCategory);
    return category?.name === "all" ? "All Categories" : category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 bg-white rounded-lg shadow-md">
      {/* Header with responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Transactions</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
          >
            <PieChart size={isMobileScreen ? 14 : 16} />
            <span className="hidden sm:inline">{showAnalytics ? "Hide Analytics" : "Show Analytics"}</span>
          </button>
          {isMobileScreen && (
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
            >
              <Sliders size={14} />
            </button>
          )}
          <button className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">
            <Download size={isMobileScreen ? 14 : 16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
      
      {/* Analytics panel */}
      {showAnalytics && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-indigo-800 mb-2 sm:mb-3">Category Analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">Total Spending</p>
              <p className={`text-lg sm:text-xl font-bold ${categoryTotal > 0 ? "text-red-600" : "text-green-600"}`}>
                {formatCurrency(categoryTotal)} {categoryTotal > 0 ? "spent" : "received"}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">Average Transaction</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {formatCurrency(averageTransaction)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">Transaction Count</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {filteredTransactions.length}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Responsive Category Selection */}
      {isSmallScreen ? (
        <div className="mb-4 sm:mb-6 relative">
          <button 
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg bg-white flex justify-between items-center"
          >
            <div className="flex items-center">
              <span className="font-medium text-sm sm:text-base">{getCurrentCategoryDisplayName()}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({categories.find(c => c.name === selectedCategory)?.count || 0} items)
              </span>
            </div>
            <ChevronDown size={isMobileScreen ? 16 : 18} className={`text-gray-500 transition-transform ${showCategoryDropdown ? 'transform rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown menu */}
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {categories.map(category => (
                <button
                  key={category.name}
                  className={`w-full p-2 sm:p-3 text-left border-b border-gray-100 last:border-b-0 flex justify-between items-center ${
                    selectedCategory === category.name ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <div>
                    <span className="font-medium capitalize text-sm sm:text-base">{category.name === "all" ? "All Categories" : category.name}</span>
                    <span className="ml-2 text-xs text-gray-500">({category.count} items)</span>
                  </div>
                  <span className={`font-medium text-xs sm:text-sm ${category.total > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(category.total)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Category tabs with improved visualization - only shown on larger screens */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.name}
              className={`p-3 rounded-lg text-sm font-medium flex flex-col items-start ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="capitalize mb-1">{category.name === "all" ? "All Categories" : category.name}</span>
              <div className="flex justify-between w-full">
                <span className={`text-xs ${selectedCategory === category.name ? "text-blue-100" : "text-gray-500"}`}>
                  {category.count} items
                </span>
                <span className={category.total > 0 ? "text-red-400" : "text-green-400"}>
                  {formatCurrency(category.total)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Filters and search - Collapsible on mobile */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobileScreen && !showFilters ? 'max-h-0 opacity-0 mb-0' : 'max-h-72 opacity-100 mb-4 sm:mb-6'}`}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={isMobileScreen ? 14 : 16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last30">{month}</option>
              <option value="last7">Last 7 days</option>
            </select>
            
            <select
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest amount</option>
              <option value="lowest">Lowest amount</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Transactions list - Responsive table/card view */}
      <div className="bg-white rounded-lg border border-gray-200">
        {sortedTransactions.length === 0 ? (
          <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
            {searchTerm ? "No matching transactions found" : "No transactions in this category"}
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center">
                            {transaction.amount > 0 ? (
                              <div className="bg-red-100 h-full w-full rounded-full flex items-center justify-center">
                                <ArrowDownLeft size={14} className="text-red-600" />
                              </div>
                            ) : (
                              <div className="bg-green-100 h-full w-full rounded-full flex items-center justify-center">
                                <ArrowUpRight size={14} className="text-green-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {transaction.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.category.join(" › ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-2" />
                          <span className="text-xs sm:text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-right font-medium">
                        <span className={transaction.amount > 0 ? "text-red-600" : "text-green-600"}>
                          {formatCurrency(transaction.amount, transaction.iso_currency_code)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Card view for mobile */}
            <div className="sm:hidden divide-y divide-gray-200">
              {sortedTransactions.map((transaction, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2">
                        {transaction.amount > 0 ? (
                          <div className="bg-red-100 h-full w-full rounded-full flex items-center justify-center">
                            <ArrowDownLeft size={14} className="text-red-600" />
                          </div>
                        ) : (
                          <div className="bg-green-100 h-full w-full rounded-full flex items-center justify-center">
                            <ArrowUpRight size={14} className="text-green-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.category[0]}
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${transaction.amount > 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(transaction.amount, transaction.iso_currency_code)}
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-xs text-gray-500">
                    <Calendar size={12} className="text-gray-400 mr-1" />
                    {formatDate(transaction.date)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;