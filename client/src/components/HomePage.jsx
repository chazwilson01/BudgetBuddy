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
        {
            icon: <DollarSign className="w-6 h-6 text-blue-300" />,
            title: "Financial Goals",
            description: "Set savings goals and track your progress toward financial freedom"
        },
        {
            icon: <Shield className="w-6 h-6 text-blue-300" />,
            title: "Secure Bank Connection",
            description: "Safely connect your accounts with bank-level security"
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
                        
                        {/* Hero Image/Mockup */}
                        <div className={`mt-10 md:mt-0 md:w-1/2 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}>
                            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                                <div className="h-6 bg-gray-700 flex items-center px-4">
                                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                </div>
                                <div className="p-6 bg-blue-900 text-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold">Monthly Overview</h3>
                                        <span className="text-sm">March 2025</span>
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-70 rounded-lg p-4 mb-4">
                                        <div className="flex justify-between mb-2">
                                            <span>Total Budget</span>
                                            <span className="font-bold">$4,500.00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Spent</span>
                                            <span className="font-bold">$2,240.33</span>
                                        </div>
                                        <div className="mt-2 h-2 bg-blue-700 rounded-full overflow-hidden">
                                            <div className="bg-blue-300 h-full rounded-full" style={{ width: "50%" }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                                                <span>Housing</span>
                                            </div>
                                            <span>$1,200.00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                                                <span>Food</span>
                                            </div>
                                            <span>$530.75</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                                                <span>Transportation</span>
                                            </div>
                                            <span>$212.48</span>
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
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <p className="mt-4 text-sm text-blue-300">No credit card required. Cancel anytime.</p>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <TrendingUp className="h-6 w-6 text-blue-300" />
                                <span className="ml-2 text-xl font-bold">BudgetBuddy</span>
                            </div>
                            <p className="text-blue-200">Your personal finance companion for a brighter financial future.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Financial Guides</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Company</h4>
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