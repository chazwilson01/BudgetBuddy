// UserContext.jsx - Updated with deleteAccount function
import { createContext, useContext, useEffect } from "react";
import { usePersistentState } from './usePersistentState';
import axios from 'axios';
import categorizeTransactions from "../components/functions/categorizeTransactions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Use the custom hook for each state that needs persistence
  const [userId, setUserId] = usePersistentState("userId", null);
  const [userEmail, setUserEmail] = usePersistentState("userEmail", null);
  const [hasBudget, setHasBudget] = usePersistentState("hasBudget", false);
  const [plaidConnect, setPlaidConnect] = usePersistentState("plaidConnect", false);
  const [budget, setBudget] = usePersistentState("budget", null);
  const [transactions, setTransactions] = usePersistentState("transactions", null);
  const [totalBudget, setTotalBudget] = usePersistentState("totalBudget", 0);
  const [totalSpent, setTotalSpent] = usePersistentState("totalSpent", 0);
  const [loading, setLoading] = usePersistentState("loading", true);

  // Effect to fetch data on component mount/reload
  useEffect(() => {
    if (userId) {
      // Fetch both budget and transactions when component mounts/reloads
      setLoading(true)
      fetchBudget();
      fetchTransactions();
      setLoading(false)
    }
  }, [userId]); // Re-run when userId changes

  // Fetch budget from API
  const fetchBudget = async () => {
    try {
      const response = await axios.get('https://localhost:5252/api/Budget/getBudget', {
        withCredentials: true
      });
      
      // Process data from the BudgetDto format
      if (response.data) {
        const budgetData = response.data;
        const income = budgetData.income || 5000;
        
        // Convert BudgetDto to categories array format
        const categoryData = [
          { id: 'rent', name: 'Rent', amount: budgetData.rent, color: '#FF6384' },
          { id: 'utilities', name: 'Utilities', amount: budgetData.utilities, color: '#36A2EB' },
          { id: 'groceries', name: 'Groceries', amount: budgetData.groceries, color: '#FFCE56' },
          { id: 'transportation', name: 'Transportation', amount: budgetData.transportation, color: '#4BC0C0' },
          { id: 'entertainment', name: 'Entertainment', amount: budgetData.entertainment, color: '#9966FF' },
          { id: 'insurance', name: 'Insurance', amount: budgetData.insurance, color: '#FF9F40' },
          { id: 'loans', name: 'Loans', amount: budgetData.loans, color: '#C9CBCF' },
          { id: 'savings', name: 'Savings', amount: budgetData.savings, color: '#7BC043' },
          { id: 'other', name: 'Other', amount: budgetData.other, color: '#F37736' }
        ];
        
        // Calculate percentage for each category
        const processedCategories = categoryData.map(cat => ({
          ...cat,
          percentage: income > 0 ? parseFloat(((cat.amount / income) * 100).toFixed(1)) : 0
        }));
        
        setBudget(processedCategories);
        sessionStorage.setItem("budget", JSON.stringify(processedCategories));
        sessionStorage.setItem("income", income);
        
        // Calculate total budget
        const totalBudgetAmount = processedCategories.reduce((sum, cat) => sum + cat.amount, 0);
        setTotalBudget(totalBudgetAmount);
        setHasBudget(true);
      } 
    } catch (error) {
      console.error('Error fetching budget:', error);
      // Handle error but don't create default categories
    } 
  };

  const fetchTransactions = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(
        `https://localhost:5252/api/plaid/transactions/${userId}`,
        { withCredentials: true }
      );

      const fetchedTransactions = response.data.transactions || [];
      console.log(fetchedTransactions);
      
      // Categorize transactions
      if (fetchedTransactions.length > 0) {
        const categorized = categorizeTransactions(fetchedTransactions);
        sessionStorage.setItem("transactions", JSON.stringify(categorized));
        setTransactions(categorized);
        console.log(categorized);

        // Calculate total spent
        if (categorized.categorizedSpending) {
          const totalSpentAmount = Object.values(categorized.categorizedSpending)
            .reduce((sum, amount) => sum + amount, 0);
          setTotalSpent(totalSpentAmount);
        }
        
        setPlaidConnect(true);
      }
      
      console.log("Transactions fetched and categorized");
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      setLoading(true);
      
      // Confirm the user wants to delete their account
      const confirmed = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
      );
      
      if (!confirmed) {
        setLoading(false);
        return { success: false, message: "Account deletion cancelled" };
      }
      
      // Make API call to delete the account
      await axios.delete(`https://localhost:5252/api/auth/delete-user`, {
        withCredentials: true
      });
      
      // Clear all local storage data
      sessionStorage.clear();
      localStorage.clear();
      
      // Reset all states
      setUserId(null);
      setUserEmail(null);
      setHasBudget(false);
      setPlaidConnect(false);
      setBudget(null);
      setTransactions(null);
      setTotalBudget(0);
      setTotalSpent(0);
      
      setLoading(false);
      return { success: true, message: "Account deleted successfully" };
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
      return { 
        success: false, 
        message: "Failed to delete account", 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call the logout API endpoint
      const res = await axios.post('https://localhost:5252/api/Auth/logout', {}, {
        withCredentials: true
      });

      console.log(res)
      
      // Clear session storage
      sessionStorage.clear();
      
      // Reset states
      setUserId(null);
      setUserEmail(null);
      setHasBudget(false);
      setPlaidConnect(false);
      setBudget(null);
      setTransactions(null);
      setTotalBudget(0);
      setTotalSpent(0);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return (
    <UserContext.Provider value={{ 
      userId, userEmail, hasBudget, plaidConnect, budget, transactions,
      totalBudget, totalSpent, loading,
      setUserId, setUserEmail, setHasBudget, setPlaidConnect, setBudget, setTransactions, setLoading,
      fetchBudget, fetchTransactions, deleteAccount, logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);