import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff, User, Phone, TrendingUp } from 'lucide-react';
import Spinner from "./Spinner";
import "./Spinner.css";
import "./HeaderBear.css";

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        try {
            const response = await axios.post("https://localhost:5252/api/Auth/register", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber || null, // Optional field
                password: password
            });

            console.log(response.data);
            setSuccess(true);
            
            // Redirect to login page after successful signup
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Error signing up:", error);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 w-screen">
            {/* Navigation */}
            <div className="absolute top-0 left-0 w-full p-6">
                <div onClick={() => navigate("/")} className="flex items-center cursor-pointer w-fit">
                    <div className="header-bear"></div>
                    <span className="ml-2 text-xl font-bold text-white">BudgetBuddy</span>
                </div>
            </div>
            
            {success ? (
                <div className="text-center">
                    <Spinner />
                    <h2 className="text-blue-300 mt-4">Creating your account...</h2>
                </div>
            ) : (
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">Create Account</h1>
                        <p className="text-blue-300 mt-2">Sign up to get started</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-900 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="block text-sm font-medium text-blue-200 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="block text-sm font-medium text-blue-200 mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

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
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-blue-200 mb-2">
                                Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    placeholder="(123) 456-7890"
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
                                    placeholder="Create a password"
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
                            <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters long</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-blue-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-blue-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        >
                            Create Account
                        </button>
                    </form>
                    
                    <div className="text-center">
                        <p className="mt-2 text-sm text-blue-200">
                            Already have an account?{' '}
                            <a href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;