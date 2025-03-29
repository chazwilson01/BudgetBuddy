import { useEffect, useState } from "react";
import PieChartComponent from "./PIeChart";
import Spinner from "./Spinner";
import { useUser } from "../contexts/Context";
import BudgetProgressBars from "./BudgetProgress";
import categorizeTransactions from "./functions/categorizeTransactions";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { userId, setTransactions, transactions, setBudget, budget, loading, setLoading } = useUser();
    
    const [categorizedData, setCategorizedData] = useState(null);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [elementsVisible, setElementsVisible] = useState({
      heading: false,
      summary: false,
      cards: false
    });

    // In your actual implementation, uncomment this:
    // const navigate = useNavigate();
    // For this example, we'll use a placeholder function
    const navigate = useNavigate()

    // Animation sequence timing
    useEffect(() => {
      if (!loading) {
        // Start the animation sequence after data is loaded
        setPageLoaded(true);
        
        // Staggered animations
        const timers = [
          setTimeout(() => setElementsVisible(prev => ({ ...prev, heading: true })), 300),
          setTimeout(() => setElementsVisible(prev => ({ ...prev, summary: true })), 600),
          setTimeout(() => setElementsVisible(prev => ({ ...prev, cards: true })), 900)
        ];
        
        return () => timers.forEach(timer => clearTimeout(timer));
      }
    }, [loading]);
    
    useEffect(() => {
        console.log(transactions);
        console.log("TYPEOF BUDGET", typeof budget);
        
        // Calculate totals if we already have data
        if (budget && transactions) {
            const totalBudgetAmount = budget.reduce((sum, cat) => sum + cat.amount, 0);
            setTotalBudget(totalBudgetAmount);
            
            if (transactions.categorizedSpending) {
                const totalSpentAmount = Object.values(transactions.categorizedSpending)
                    .reduce((sum, amount) => sum + amount, 0);
                setTotalSpent(totalSpentAmount);
            }

            return;
        }
    }, [userId, budget, transactions]); 

    const handleFinanceNav = () => {
        navigate('/finance');
    };

    const handleBudgetNav = () => {
        navigate("/budget");
    };

    const handleSettingsNav = () => {
      navigate("/settings")
    }
    
    // Calculate remaining budget and percentage
    const remainingBudget = totalBudget - totalSpent;
    const percentSpent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    
    // Get current month and year
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    
    // Initial loading animation
    if (loading) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900 px-4 py-6">
          <div className="animate-pulse">
            <Spinner />
          </div>
          <p className="text-white mt-4 animate-pulse">Loading your dashboard...</p>
        </div>
      );
    }
    
    return (
        <div className={`w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900 px-4 py-6`}>
          <div className="w-full max-w-6xl">
              {/* Heading with fade-in animation */}
              <div 
                className={`w-full text-center mb-8 transform transition-all duration-700 ease-out ${
                  elementsVisible.heading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
                }`}
              > 
                <h1 className="text-white text-2xl sm:text-3xl font-bold">Welcome to your BudgetBuddy!</h1>
                <p className="text-blue-200 mt-2">{month} {year}</p>
              </div>
              
              {/* Budget Progress Summary with slide-in animation */}
              <div 
                className={`w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-5 mb-10 transform transition-all duration-700 ease-out ${
                  elementsVisible.summary ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Budget Overview</h2>
                  
                  {/* Summary Stats */}
                  <div className="flex space-x-4 text-sm">
                    <div>
                      <span className="text-gray-500 mr-1">Budget:</span>
                      <span className="font-semibold">${totalBudget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 mr-1">Spent:</span>
                      <span className="font-semibold">${totalSpent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 mr-1">Left:</span>
                      <span className="font-semibold text-blue-600">${remainingBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar with animation */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{percentSpent}% of budget used</span>
                    <span>${remainingBudget.toLocaleString()} remaining</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        percentSpent > 90 ? 'bg-red-500' : 
                        percentSpent > 75 ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      } transition-all duration-1000 ease-out`}
                      style={{ width: elementsVisible.summary ? `${Math.min(percentSpent, 100)}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Card grid with staggered pop-in animation */}
              <div 
                className={`w-full flex justify-center transition-all duration-700 ease-out ${
                  elementsVisible.cards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
              >
                <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Finances Card */}
                  <div 
                    className="bg-white rounded-xl shadow-lg p-4 transition-all 
                    duration-300 hover:shadow-xl hover:scale-105 hover:rotate-1 transform
                    flex flex-col items-center justify-center max-w-xs mx-auto w-full aspect-square cursor-pointer"
                    onClick={handleFinanceNav}
                  >
                    <div className="bg-blue-100 p-2 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-base font-bold text-gray-800 mb-1">Finances</h2>
                    <p className="text-xs text-gray-600 text-center">View in-depth breakdown of your budget and spending</p>
                  </div>
                  
                  {/* Budget Card */}
                  <div 
                    className="bg-white rounded-xl shadow-lg p-4 transition-all duration-300 
                    hover:shadow-xl hover:scale-105 hover:rotate-1 transform
                    flex flex-col items-center justify-center max-w-xs mx-auto w-full aspect-square cursor-pointer"
                    onClick={handleBudgetNav}
                  >
                    <div className="bg-green-100 p-2 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-base font-bold text-gray-800 mb-1">Budget</h2>
                    <p className="text-xs text-gray-600 text-center">Plan and manage your spending</p>
                  </div>
                  
                  {/* Settings Card */}
                  <div className="bg-white rounded-xl shadow-lg p-4 transition-all duration-300 
                    hover:shadow-xl hover:scale-105 hover:rotate-1 transform
                    flex flex-col items-center justify-center max-w-xs mx-auto w-full aspect-square cursor-pointer"
                    onClick={handleSettingsNav}
                    >
                    <div className="bg-purple-100 p-2 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-base font-bold text-gray-800 mb-1">Settings</h2>
                    <p className="text-xs text-gray-600 text-center">Customize your experience</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      );
};

export default Dashboard;