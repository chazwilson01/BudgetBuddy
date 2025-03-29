import BudgetProgressBars from "./BudgetProgress";
import RecentTransactions from "./RecentTransactions";
import Calandar from "./Calander";
import { useState, useEffect } from "react";

const Finance = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on component mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-gray-800 to-blue-900 flex flex-col">
      <header className="p-3 sm:p-4">
        <h1 className={`text-lg sm:text-xl font-bold text-white mb-7 sm:mb-4 sm:ml-4 text-center md:text-left`}>Financial Overview</h1>
        
        {/* Tab Navigation - Modified for mobile */}
        <div className="flex bg-blue-800 bg-opacity-30 p-1 rounded-lg md:space-x-1">
          <button 
            className={`flex-1 md:flex-initial py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 text-center ${
              activeTab === 'budget' 
                ? 'bg-white text-blue-800' 
                : 'text-white hover:bg-white hover:bg-opacity-10 hover:text-blue-800'
            }`}
            onClick={() => setActiveTab('budget')}
          >
            {isMobile ? 'Budget' : 'Budget & Calendar'}
          </button>
          
          <button 
            className={`flex-1 md:flex-initial py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 text-center ${
              activeTab === 'transactions' 
                ? 'bg-white text-blue-800' 
                : 'text-white hover:bg-white hover:bg-opacity-10 hover:text-blue-800'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            {isMobile ? 'Transactions' : 'Recent Transactions'}
          </button>
        </div>
      </header>
      
      {/* Tab Content */}
      <div className="flex-1 p-2 sm:p-4 overflow-auto">
        <div className="rounded-lg shadow-lg h-full overflow-auto">
          {activeTab === 'budget' ? (
            <div className="flex justify-center p-2 sm:p-2 h-full">
              {/* Responsive grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-6xl w-full">
                {/* Calendar - Full width on mobile, half width on tablet/desktop */}
                <div className="w-full order-2 md:order-1">
                  <Calandar />
                </div>
                
                {/* Budget Progress - Full width on mobile, half width on tablet/desktop */}
                <div className="w-full order-1 md:order-2">
                  <BudgetProgressBars />
                </div>
              </div>
            </div>
          ) : (
            <RecentTransactions />
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;