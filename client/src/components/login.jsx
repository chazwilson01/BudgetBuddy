import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useUser } from "../contexts/Context";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserId, setUserEmail, setHasBudget, setPlaidConnect } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            const response = await axios.post("https://localhost:5252/api/Auth/login", {
                email: email,
                password: password
            }, { withCredentials: true });

            console.log(response.data);
            
            
            if (response.data.message === "Login successful") {
                console.log("TYPE OF HASBUDGET ", typeof response.data.user.hasBudget)
                setUserEmail(response.data.user.email);
                setUserId(response.data.user.id);
                setHasBudget(response.data.user.hasBudget);
                sessionStorage.setItem("userId", response.data.user.id);
                sessionStorage.setItem("email", response.data.user.email);
                sessionStorage.setItem("hasBudget", response.data.user.hasBudget);
                try {
                    const check = await axios.get("https://localhost:5252/api/Plaid/check", { withCredentials: true });
                    console.log(check.data);

                    setPlaidConnect(check.data.plaidLinked)
                    sessionStorage.setItem("plaidConnect", check.data.plaidLinked)


                    if (check.data.plaidLinked === true && response.data.user.hasBudget) {
                        navigate("/dashboard");
                    } else {
                        navigate("/setup")
                    }
                } catch (checkError) {
                    console.error("Error checking Plaid status:", checkError);
                    setError("Unable to verify Plaid connection. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 w-screen">
            {/* Navigation */}
            <div className="absolute top-0 left-0 w-full p-6">
                <div onClick={() => navigate("/")} className="flex items-center cursor-pointer w-fit">
                    <TrendingUp className="h-6 w-6 text-blue-300" />
                    <span className="ml-2 text-xl font-bold text-white">BudgetBuddy</span>
                </div>
            </div>
            
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-blue-300 mt-2">Sign in to your account</p>
                </div>
                
                {error && (
                    <div className="bg-red-900 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-blue-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-blue-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-blue-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-blue-400" />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-700"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                                Remember me
                            </label>
                        </div>
                        
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
                
                <div className="text-center">
                    <p className="mt-2 text-sm text-blue-200">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;