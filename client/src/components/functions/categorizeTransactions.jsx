/**
 * Groups Plaid transactions into budget categories
 * 
 * @param {Array} transactions - Array of Plaid transaction objects
 * @returns {Object} - Object with spending by category and mapped transactions
 */
function categorizeTransactions(transactions) {
    // Define category mapping - maps Plaid categories to your budget categories
    const categoryMapping = {
      // Housing
      "rent": ["Rent", "Mortgage", "Real Estate", "Apartments", "Housing"],
      
      // Utilities
      "utilities": ["Utilities", "Electric", "Gas", "Water", "Internet", "Cable", "Phone", "Mobile Phone", 
                   "Television", "Internet Service Providers", "Telecommunication Services"],
      
      // Food & Groceries
      "food": ["Supermarkets", "Groceries", "Food and Drink", "Grocery", "Convenience Stores"],
      
      // Transportation
      "transportation": ["Gas", "Gas Stations", "Automotive", "Public Transportation", "Taxi", "Uber", "Lyft",
                        "Parking", "Car Service", "Airlines", "Air Travel", "Rail", "Parking Fees", "Car Rental", "Travel"],
      
      // Entertainment & Leisure
      "recreation": ["Entertainment", "Movies", "Music", "Recreation", "Arts", "Sports", "Games", "Amusement", 
                       "Restaurants", "Food and Drink", "Dining", "Bar", "Coffee Shop", "Fast Food", "Subscription",
                       "Streaming", "Concerts", "Events", "Theaters", "Bowling"],
      
      // Insurance
      "insurance": ["Insurance", "Auto Insurance", "Health Insurance", "Life Insurance", "Home Insurance"],
      
      // Loans & Debt
      "loans": ["Loan", "Student Loan", "Credit Card", "Credit Card Payment", "Personal Loan", "Debt", "Student Loans",
               "Credit Card Payments", "Loans and Mortgages"],
      
      // Savings & Investments
      "savings": [ "Deposit", "Savings", "Investment", "Retirement", "Financial", "Banking", 
                 "Investments", "Retirement Contributions", "Brokerage", "Checking"],
      
      // Default/Other
      "other": ["Transfer"]  // This will catch anything not categorized above
    };
  
    // Initialize results object with spending totals and transaction lists
    const results = {
      categorizedSpending: {
        rent: 0,
        utilities: 0,
        food: 0,
        transportation: 0, 
        recreation: 0,
        insurance: 0,
        loans: 0,
        savings: 0,
        other: 0
      },
      transactionsByCategory: {
        rent: [],
        utilities: [],
        food: [],
        transportation: [],
        recreation: [],
        insurance: [],
        loans: [], 
        savings: [],
        other: []
      }
    };
  
    // Process each transaction
    transactions.forEach(transaction => {
      // Skip pending transactions or deposits (positive amounts)
      if (transaction.pending) {
        return;
      }
  
      // Convert amount to positive for easier calculation (Plaid uses negative for expenses)
      const amount = transaction.amount;
      
      // Get Plaid categories (if available)
      const plaidCategories = transaction.category || [];
      const merchantName = transaction.merchant_name || transaction.name || '';
      
      // Try to match to one of our budget categories
      let matchedCategory = 'other'; // Default category
  
      // First check based on Plaid categories
      categoryLoop:
      for (const [budgetCategory, keywords] of Object.entries(categoryMapping)) {
        // Check if any Plaid category matches our keywords
        for (const plaidCategory of plaidCategories) {
          for (const keyword of keywords) {
            if (plaidCategory.toLowerCase().includes(keyword.toLowerCase())) {
              matchedCategory = budgetCategory;
              break categoryLoop;
            }
          }
        }
        
        // Also check merchant name
        for (const keyword of keywords) {
          if (merchantName.toLowerCase().includes(keyword.toLowerCase())) {
            matchedCategory = budgetCategory;
            break categoryLoop;
          }
        }
      }
  
      // Special case handling based on transaction description
      const description = transaction.name?.toLowerCase() || '';
      
      // Override category based on specific keywords in the description
      if (/rent|lease|apartment|housing/i.test(description)) {
        matchedCategory = 'rent';
      } else if (/electric|gas|water|utility|internet|cable|phone|mobile/i.test(description)) {
        matchedCategory = 'utilities';
      } else if (/grocery|supermarket|food|trader|whole foods|safeway|kroger|publix|walmart|target/i.test(description)) {
        matchedCategory = 'food';
      } else if (/uber|lyft|taxi|gas|shell|exxon|chevron|bp|car service|car repair|auto|transit/i.test(description)) {
        matchedCategory = 'transportation';
      } else if (/restaurant|dining|grubhub|doordash|ubereats|starbucks|cafe|coffee|movie|theater|entertainment|netflix|spotify|hulu|disney/i.test(description)) {
        matchedCategory = 'recreation';
      } else if (/insurance|geico|state farm|progressive|allstate|anthem|cigna|aetna/i.test(description)) {
        matchedCategory = 'insurance';
      } else if (/loan|lending|credit card payment|mortgage payment|student loan|auto loan/i.test(description)) {
        matchedCategory = 'loans';
      } else if (/transfer to savings|deposit|investment|fidelity|vanguard|schwab|401k|ira/i.test(description)) {
        matchedCategory = 'savings';
      }
  
      // Add amount to the matched category
      results.categorizedSpending[matchedCategory] += amount;
      
      // Add transaction to the category's transaction list
      results.transactionsByCategory[matchedCategory].push({
        ...transaction,
        budgetCategory: matchedCategory
      });
    });
  
    return results;
  }
  
  export default categorizeTransactions;