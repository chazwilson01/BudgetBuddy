import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/Context";
import { TrendingUp, DollarSign, PlusCircle, MinusCircle, Save, ArrowLeft } from 'lucide-react';
import axios from "axios";

const CreateBudget = () => {
    const navigate = useNavigate();
    const { userId, setHasBudget } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // Budget categories with initial values
    const [categories, setCategories] = useState([
        { id: 1, name: "Housing", amount: "", color: "#4f46e5" },
        { id: 2, name: "Food", amount: "", color: "#0ea5e9" },
        { id: 3, name: "Transportation", amount: "", color: "#10b981" },
        { id: 4, name: "Utilities", amount: "", color: "#f59e0b" },
        { id: 5, name: "Entertainment", amount: "", color: "#ef4444" },
    ]);
    
    // Income state
    const [income, setIncome] = useState("");
    
    // Custom category input
    const [newCategory, setNewCategory] = useState({
        name: "",
        amount: "",
        color: "#6366f1"
    });

    // Get total budget amount
    const totalBudgetAmount = categories.reduce((total, category) => total + Number(category.amount), 0);
    
    // Calculate remaining amount
    const remainingAmount = Number(income) - totalBudgetAmount;
    
    // Handle category amount change
    const handleCategoryChange = (id, value) => {
        setCategories(categories.map(category => 
            category.id === id ? { ...category, amount: value } : category
        ));
    };
    
    // Handle income change
    const handleIncomeChange = (value) => {
        setIncome(value);
    };
    
    // Add new category
    const addNewCategory = () => {
        if (newCategory.name.trim() === "") {
            setError("Please enter a category name");
            return;
        }
        
        if (Number(newCategory.amount) <= 0) {
            setError("Amount must be greater than 0");
            return;
        }
        
        const nextId = Math.max(...categories.map(c => c.id)) + 1;
        setCategories([...categories, { ...newCategory, id: nextId }]);
        setNewCategory({ name: "", amount: "", color: "#6366f1" });
        setError("");
    };
    
    // Remove a category
    const removeCategory = (id) => {
        setCategories(categories.filter(category => category.id !== id));
    };
    
    // Submit budget
    const submitBudget = async () => {
        try {
            // Validate budget
            if (Number(income.monthly) <= 0) {
                setError("Please enter your monthly income");
                return;
            }
            
            if (totalBudgetAmount <= 0) {
                setError("Please allocate your budget to at least one category");
                return;
            }
            
            if (totalBudgetAmount > Number(income.monthly)) {
                setError("Your budget exceeds your income");
                return;
            }
            
            setLoading(true);
            setError("");
            
            // Create budget data to send to server
            const budgetData = {
                Income: Number(income),
                Categories: categories.map(category => ({
                    Category: category.name,
                    Amount: Number(category.amount),
                    Color: category.color
                }))
            };

            console.log(budgetData)
            
            // Send budget to the server
            const response = await axios.post("https://localhost:5252/api/Budget/create", budgetData, {
                withCredentials: true
            });
            
            setSuccess("Budget created successfully!");
            setHasBudget(true);
            sessionStorage.setItem("hasBudget", "true");
            
            // Redirect to dashboard after successful budget creation
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
            
        } catch (error) {
            console.error("Error creating budget:", error);
            setError(error.response?.data?.message || "Failed to create budget. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 text-white">
            {/* Header/Navigation */}
            <div className="w-full p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <TrendingUp className="h-6 w-6 text-blue-300" />
                        <span className="ml-2 text-xl font-bold text-white">BudgetBuddy</span>
                    </div>
                    <button 
                        onClick={() => navigate("/setup")}
                        className="flex items-center text-blue-300 hover:text-blue-200"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Setup
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Create Your Budget</h1>
                    <p className="text-xl text-blue-300">Set spending limits for each category to stay on track</p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-900 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-900 bg-opacity-40 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
                        {success}
                    </div>
                )}

                <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8 mb-8">
                    {/* Income Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <DollarSign className="h-6 w-6 text-green-400 mr-2" />
                            Monthly Income
                        </h2>
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <div className="flex items-center">
                                <span className="text-lg mr-4 w-32">Monthly Income:</span>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">$</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={income}
                                        onChange={(e) => {
                                            let sanitizedValue = e.target.value.replace(/\D/g, "");
                                            sanitizedValue = sanitizedValue.replace(/^0+/, ""); // Remove leading zeros                                            // Ensures only numbers
                                            handleIncomeChange(sanitizedValue)}}
                                        className="w-full pl-8 p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Categories */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Budget Categories</h2>
                        
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <div key={category.id} className="bg-gray-700 p-4 rounded-lg flex items-center">
                                    <div 
                                        className="w-4 h-16 rounded-sm mr-4" 
                                        style={{ backgroundColor: category.color }}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="text-lg font-medium">{category.name}</div>
                                    </div>
                                    <div className="relative w-48">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400">$</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={category.amount}
                                            onChange={(e) => {
                                                let sanitizedValue = e.target.value.replace(/\D/g, "");
                                                sanitizedValue = sanitizedValue.replace(/^0+/, ""); // Remove leading zeros
                                                // Ensures only numbers
                                                handleCategoryChange(category.id, sanitizedValue)}}
                                            className="w-full pl-8 p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => removeCategory(category.id)}
                                        className="ml-4 p-2 text-red-400 hover:text-red-300 transition duration-200"
                                    >
                                        <MinusCircle className="h-6 w-6" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add New Category */}
                    <div className="mb-8 bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Savings, Healthcare"
                                />
                            </div>
                            <div className="w-48">
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={newCategory.amount}
                                        onChange={(e) => setNewCategory({...newCategory, amount: e.target.value})}
                                        className="w-full pl-8 p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="w-48">
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                                    className="w-full h-11 p-1 bg-gray-800 border border-gray-600 rounded-md cursor-pointer"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={addNewCategory}
                                    className="h-11 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center"
                                >
                                    <PlusCircle className="h-5 w-5 mr-2" />
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Budget Summary */}
                    <div className="bg-gray-900 rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-bold mb-4">Budget Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Monthly Income:</span>
                                <span className="text-green-400 font-bold">${income}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Total Allocated:</span>
                                <span className="text-blue-400 font-bold">${totalBudgetAmount.toFixed(0)}</span>
                            </div>
                            <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                                <span className="font-semibold">Remaining Unallocated:</span>
                                <span className={`font-bold ${remainingAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    ${remainingAmount.toFixed()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={submitBudget}
                            disabled={loading || remainingAmount < 0}
                            className={`py-3 px-8 rounded-md font-semibold flex items-center transition duration-300 ${
                                loading || remainingAmount < 0
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Budget...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Save className="h-5 w-5 mr-2" />
                                    Save Budget
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Helpful Tips */}
                <div className="bg-blue-900 bg-opacity-30 rounded-xl p-6 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-3">Budget Tips</h3>
                    <ul className="space-y-2 text-blue-200">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Consider using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Don't forget to include irregular expenses like annual subscriptions or seasonal costs</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Make sure to allocate all your income to avoid untracked spending</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateBudget;