const CTASection = ({ handleSignup }) => {
    return (
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
    );
};

export default CTASection; 