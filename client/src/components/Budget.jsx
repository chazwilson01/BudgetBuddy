import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/Context';
import BudgetPresentation from './BudgetReport';
import "./Budget.css"
import axios from 'axios';

const Budget = () => {
    const [income, setIncome] = useState("");
    const [expenses, setExpenses] = useState(0);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [createBudget, setCreateBudget] = useState(false);
    const [incomeCheck, setIncomeCheck] = useState(false);
    const [autoCreateBudget, setAutoCreateBudget] = useState(false);
    const [showBudget, setShowBudget] = useState(false);


    const { hasBudget, setHasBudget } = useUser();

    const budgetCheck = hasBudget 



    const saveBudget = async () => {

        try{
            const response = await axios.post("https://localhost:5252/api/Budget/create", {
                Income: Math.round(income),
                Rent: Math.round(income * 0.3),
                Utilities: Math.round(income * 0.07),
                Groceries: Math.round(income * 0.12),
                Transportation: Math.round(income * 0.1),
                Entertainment: Math.round(income * 0.05),
                Insurance: Math.round(income * 0.08),
                Loans: Math.round(income * 0.08),
                Savings: Math.round(income * 0.15),
                Other: Math.round(income * 0.05),
            }, 
            {
                withCredentials: true
            }
        );

        const update = await axios.put("https://localhost:5252/api/Auth/update-budget-status",
            {
                hasBudget: true
            },
            {withCredentials: true}
        )

        sessionStorage.setItem("hasBudget", true)
    
        console.log(response)
        } catch(error){
            console.error("Error saving budget:", error);
        }
    }

    const handleInitialChoice = () => {
        setCreateBudget(true);
    };

    const handleIncomeChange = (e) => {
        // Remove leading zeros if present
        if (e.target.value < 200000000){
            const inputValue = e.target.value;
            const cleanedValue = inputValue.replace(/^0+/, '');
            setIncome(cleanedValue);
        }
       
    };

    const handleSubmitIncome = (e) => {
        e.preventDefault();
        if (income) {
            // Here you would typically save the budget information
            // For now, we'll just mark it as created
            setIncome(income);
            setIncomeCheck(true);
        }
    };

    const handleAutoCreateBudget = (click) => {
        setAutoCreateBudget(click);
        saveBudget()
    };
    
    const handleCancel = () => {
        setCreateBudget(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-blue-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!budgetCheck) {
        return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-800 to-blue-900 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
            {!autoCreateBudget ? (
                <div className={`bg-white w-full ${autoCreateBudget ? 'max-w-4xl' : 'max-w-lg'} p-4 sm:p-6 rounded-lg shadow-md duration-300 mx-auto`}>
                    {createBudget === false && (
                        <div className="text-center">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">You Haven't Created a Budget Yet</h2>
                            <p className="text-gray-600 mb-6">Set up a budget to track your spending and save more effectively</p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleInitialChoice()}
                                    className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                                >
                                    Create Budget
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Income form if they want a budget */}
                    {createBudget === true && !budgetCheck && incomeCheck === false && (
                        <div className="animate-fadeIn">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Enter your income information</h2>
                            <form onSubmit={handleSubmitIncome}>
                                <div className="mb-5">
                                    <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Income ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            id="income"
                                            value={income}
                                            onChange={handleIncomeChange}
                                            placeholder="Enter your monthly income"
                                            className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="order-2 sm:order-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="order-1 sm:order-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                    >
                                        Create Budget
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Confirmation after budget creation */}
                    {!budgetCheck && incomeCheck && !autoCreateBudget && (
                        <div className="text-center animate-fadeIn">
                            <div className="flex justify-center mb-6">
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Income Set Successfully</h3>
                            <p className="mb-6 text-gray-700">
                                Your monthly income is <span className="font-bold text-green-600">${parseFloat(income).toLocaleString()}</span>
                            </p>
                            <p className="text-gray-700 mb-6">Would you like us to automatically create a budget for you based on recommended allocations?</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                <button
                                    onClick={() => handleAutoCreateBudget(false)}
                                    className="order-2 sm:order-1 px-5 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none transition-colors"
                                >
                                    I'll Create My Own
                                </button>
                                <button
                                    onClick={() => handleAutoCreateBudget(true)}
                                    className="order-1 sm:order-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                                >
                                    Use Recommended
                                </button>
                            </div>
                        </div>
                    )}

                    
                </div>
            ) : (
                <div className="bg-white w-full max-w-4xl p-4 sm:p-6 rounded-lg shadow-md mx-auto animate-fadIn">
                <BudgetPresentation/>
            </div>
            )}

           
        </div>
        );
    }


    if(budgetCheck){
        return(
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-800 to-blue-900 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">

                <div className="w-full max-w-4xl p-4 sm:p-6 rounded-lg mx-auto animate-fadIn">
                    <BudgetPresentation/>
                </div>

            </div>
        )
    }
};



export default Budget;