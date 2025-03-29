import { useNavigate } from "react-router-dom";
import { PieChart, DollarSign, BarChart2, Shield, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const HomePage = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setIsLoaded(true);
    }, []);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignup = () => {
        navigate("/signup");
    };

    // Mock budget data for the hero mockup
    const budgetCategories = [
        { id: "housing", name: "Housing", budget: 1500, spent: 1200, icon: "🏠" },
        { id: "food", name: "Food", budget: 600, spent: 530.75, icon: "🛒" },
        { id: "transportation", name: "Transportation", budget: 300, spent: 212.48, icon: "🚗" },
    ];

    // Get current date info for the progress indicator
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysRemaining = daysInMonth - currentDay;
    const monthPercentElapsed = (currentDay / daysInMonth) * 100;

    // Calculate total budget and spending
    const totalBudget = 4500;
    const totalSpent = 2240.33;
    const percentSpent = (totalSpent / totalBudget) * 100;

    // Features list
    const features = [
        {
            icon: <PieChart className="w-6 h-6 text-blue-300" />,
            title: "Budget Tracking",
            description: "Set and monitor your monthly budgets across multiple categories"
        },
        {
            icon: <BarChart2 className="w-6 h-6 text-blue-300" />,
            title: "Spending Analytics",
            description: "Visualize your spending patterns with intuitive charts and reports"
        },
        // {
        //     icon: <DollarSign className="w-6 h-6 text-blue-300" />,
        //     title: "Financial Goals",
        //     description: "Set savings goals and track your progress toward financial freedom"
        // },
        {
            icon: <Shield className="w-6 h-6 text-blue-300" />,
            title: "Secure Bank Connection",
            description: "Safely connect your accounts with Plaid"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 text-white">
            {/* Hero Section */}
            <div className={`relative overflow-hidden transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Background Elements */}
                <div className="absolute -top-24 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute top-64 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                
                {/* Navigation */}
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-blue-300" />
                            <span className="ml-2 text-2xl font-bold text-white">BudgetBuddy</span>
                        </div>
                        <div className="flex space-x-4">
                            <button 
                                onClick={handleLogin}
                                className="px-4 py-2 text-blue-200 font-medium hover:text-white transition-colors"
                            >
                                Log In
                            </button>
                            <button 
                                onClick={handleSignup}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-500 transition-colors"
                            >
                                Sign Up Free
                            </button>
                        </div>
                    </div>
                </nav>
                
                {/* Hero Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="md:w-1/2 md:pr-8">
                            <h1 className={`text-4xl sm:text-5xl font-extrabold text-white mb-6 transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                Take Control of Your Finances
                            </h1>
                            <p className={`text-lg text-blue-200 mb-8 transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                BudgetBuddy helps you track expenses, set budgets, and achieve your financial goals. Get started in minutes, completely free.
                            </p>
                            <div className={`space-x-4 transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <button 
                                    onClick={handleSignup}
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
                                >
                                    Get Started Now
                                </button>
                                <button className="px-6 py-3 text-blue-300 font-medium hover:text-white transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        
                        {/* Hero Mockup - Styled like an actual component */}
                        <div className={`mt-10 md:mt-0 md:w-1/2 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}>
                            <div className="w-full max-w-lg mx-auto p-5 bg-white rounded-lg shadow-lg border border-blue-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-blue-800">Monthly Budget Overview</h2>
                                    <div className="text-sm text-blue-600">
                                        <span className="font-medium">{daysRemaining} days remaining</span> • {Math.round(monthPercentElapsed)}% complete
                                    </div>
                                </div>
                                
                                {/* Total Budget Progress */}
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-blue-800 font-medium">Total Budget</span>
                                        <div className="text-right">
                                            <div className="font-medium text-blue-800">${totalSpent.toFixed(2)} <span className="text-blue-500 text-sm">of ${totalBudget.toFixed(2)}</span></div>
                                            <div className="text-xs text-blue-500">{Math.round(100 - percentSpent)}% remaining</div>
                                        </div>
                                    </div>
                                    <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden">
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-1000 ease-in-out"
                                            style={{ width: `${percentSpent}%` }}
                                        ></div>
                                        <div 
                                            className="absolute top-0 h-full border-l border-blue-700"
                                            style={{ left: `${monthPercentElapsed}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Category Breakdown */}
                                <div className="space-y-4">
                                    {budgetCategories.map((category, index) => {
                                        const percentSpent = Math.round((category.spent / category.budget) * 100);
                                        let progressBarColor = "bg-green-500";
                                        
                                        if (percentSpent > 100) {
                                            progressBarColor = "bg-red-500";
                                        } else if (percentSpent > monthPercentElapsed + 10) {
                                            progressBarColor = "bg-yellow-500";
                                        }
                                        
                                        return (
                                            <div key={index} className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{category.icon}</span>
                                                        <span className="font-medium text-blue-900">{category.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-blue-800">${category.spent.toFixed(2)} <span className="text-blue-500 text-sm">of ${category.budget}</span></div>
                                                        <div className="text-xs text-blue-500">
                                                            {Math.round(100 - percentSpent)}% remaining
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="relative h-3 bg-blue-50 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full transition-all duration-1000 ease-in-out`}
                                                        style={{ width: `${percentSpent}%` }}
                                                    ></div>
                                                    <div 
                                                        className="absolute top-0 h-full border-l border-blue-700"
                                                        style={{ left: `${monthPercentElapsed}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Legend */}
                                <div className="mt-4 pt-3 border-t border-blue-100">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                        <div className="flex items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></div>
                                            <span className="text-blue-700">On track</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1"></div>
                                            <span className="text-blue-700">Spending too fast</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></div>
                                            <span className="text-blue-700">Over budget</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Features Section */}
            <div className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white">Why Choose BudgetBuddy?</h2>
                        <p className="mt-4 text-lg text-blue-300">All the tools you need to master your finances in one place.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-600 transition-colors">
                                <div className="bg-blue-900 p-2 rounded-lg inline-block mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-blue-200">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to start your financial journey?</h2>
                    <p className="text-lg text-blue-200 mb-8">Join BudgetBuddy today and take the first step toward financial freedom.</p>
                    <button 
                        onClick={handleSignup}
                        className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-500 transition-colors text-lg"
                    >
                        Sign Up — It's Free
                    </button>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <TrendingUp className="h-6 w-6 text-blue-300" />
                                <span className="ml-2 text-xl font-bold">BudgetBuddy</span>
                            </div>
                            <p className="text-blue-200">Your personal finance companion for a brighter financial future.</p>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Creator</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-blue-300">
                        <p>&copy; {new Date().getFullYear()} BudgetBuddy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;