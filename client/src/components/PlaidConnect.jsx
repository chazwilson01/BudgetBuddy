import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/Context";
import { TrendingUp, CreditCard, DollarSign, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Setup = () => {
    const navigate = useNavigate();
    const { userId, plaidConnect, hasBudget, setPlaidConnect, setHasBudget } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        // Update active step based on what's already completed
        if (plaidConnect && !hasBudget) {
            setActiveStep(2);
        } else if (plaidConnect && hasBudget) {
            setActiveStep(3);
        }

        // Load Plaid script
        const script = document.createElement("script");
        script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
        document.body.appendChild(script);

        return () => {
            // Clean up script when component unmounts
            document.body.removeChild(script);
        };
    }, [plaidConnect, hasBudget]);

    const launchPlaid = async () => {
        try {
            setLoading(true);
            setError("");
            
            const res = await fetch("https://localhost:5252/api/plaid/create-link-token");
            if (!res.ok) {
                throw new Error("Failed to create link token");
            }
            
            const { link_token } = await res.json();
            
            const handler = window.Plaid.create({
                token: link_token,
                onSuccess: async (public_token, metadata) => {
                    try {
                        const exchangeRes = await fetch("https://localhost:5252/api/plaid/exchange-token", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ publicToken: public_token, userId: userId }),
                        });
                        
                        if (!exchangeRes.ok) {
                            throw new Error("Failed to exchange token");
                        }
                        
                        setPlaidConnect(true);
                        sessionStorage.setItem("plaidConnect", true);
                        setActiveStep(2);
                    } catch (err) {
                        setError("Failed to link your bank. Please try again.");
                        console.error(err);
                    } finally {
                        setLoading(false);
                    }
                },
                onExit: () => {
                    setLoading(false);
                },
                onLoad: () => {
                    setLoading(false);
                },
                onEvent: (eventName) => {
                    console.log(eventName);
                },
            });
            
            handler.open();
        } catch (err) {
            setError("Something went wrong. Please try again later.");
            setLoading(false);
            console.error(err);
        }
    };

    const createBudget = () => {
        // In a real app, you'd navigate to a budget creation form or modal
        navigate("/create-budget");
    };

    const finishSetup = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 text-white">
            {/* Header/Navigation */}
            <div className="w-full p-6">
                <div className="flex items-center cursor-pointer w-fit">
                    <TrendingUp className="h-6 w-6 text-blue-300" />
                    <span className="ml-2 text-xl font-bold text-white">BudgetBuddy</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Set Up Your Account</h1>
                    <p className="text-xl text-blue-300">Complete these steps to get started with BudgetBuddy</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center w-full max-w-2xl">
                        <div className={`flex-1 flex flex-col items-center ${activeStep >= 1 ? "text-blue-300" : "text-gray-500"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 1 ? "bg-blue-600" : "bg-gray-700"}`}>
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">Connect Bank</span>
                        </div>
                        
                        <div className={`w-16 h-1 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-700"}`}></div>
                        
                        <div className={`flex-1 flex flex-col items-center ${activeStep >= 2 ? "text-blue-300" : "text-gray-500"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-700"}`}>
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">Create Budget</span>
                        </div>
                        
                        <div className={`w-16 h-1 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-700"}`}></div>
                        
                        <div className={`flex-1 flex flex-col items-center ${activeStep >= 3 ? "text-blue-300" : "text-gray-500"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-700"}`}>
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">Get Started</span>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8 max-w-2xl mx-auto">
                    {activeStep === 1 && (
                        <div className="text-center">
                            <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg mb-8">
                                <CreditCard className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Connect Your Bank</h2>
                                <p className="text-blue-200 mb-6">
                                    Link your accounts to automatically track your spending and income. 
                                    BudgetBuddy uses bank-level security to keep your information safe.
                                </p>
                                <button 
                                    onClick={launchPlaid} 
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Connecting...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            Connect Bank Account <ArrowRight className="ml-2 h-5 w-5" />
                                        </span>
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-gray-400">
                                Your financial data is encrypted and secure. We use Plaid to connect to your bank securely.
                            </p>
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div className="text-center">
                            <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg mb-8">
                                <DollarSign className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Create Your Budget</h2>
                                <p className="text-blue-200 mb-6">
                                    Set up your monthly budget to track spending and save toward your goals.
                                    BudgetBuddy will help you stay on track and make smart financial decisions.
                                </p>
                                <button 
                                    onClick={createBudget} 
                                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center justify-center"
                                >
                                    <span className="flex items-center">
                                        Create Budget <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                </button>
                            </div>
                            <p className="text-sm text-gray-400">
                                You can always adjust your budget later as your financial situation changes.
                            </p>
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="text-center">
                            <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg mb-8">
                                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                                <p className="text-blue-200 mb-6">
                                    Your account is now fully configured. You're ready to start tracking your finances
                                    and achieving your financial goals with BudgetBuddy.
                                </p>
                                <button 
                                    onClick={finishSetup} 
                                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center justify-center"
                                >
                                    <span className="flex items-center">
                                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                </button>
                            </div>
                            <p className="text-sm text-gray-400">
                                Welcome to BudgetBuddy! We're excited to help you on your financial journey.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Setup;