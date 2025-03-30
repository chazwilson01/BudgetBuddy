import { PieChart, BarChart2, Shield } from "lucide-react";

const FeaturesSection = () => {
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
            icon: <Shield className="w-6 h-6 text-blue-300" />,
            title: "Secure Bank Connection",
            description: "Safely connect your accounts with Plaid"
        }
    ];

    return (
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
    );
};

export default FeaturesSection; 