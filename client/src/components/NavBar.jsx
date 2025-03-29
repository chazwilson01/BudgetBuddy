// SidebarLayout.jsx with improved initial rendering
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavBar = () => {
    // Set initial states based on window size if available, otherwise assume desktop
    const isClient = typeof window !== 'undefined';
    const initialIsMobile = isClient ? window.innerWidth < 768 : false;
    
    const [isMobile, setIsMobile] = useState(initialIsMobile);
    const [sidebarOpen, setSidebarOpen] = useState(!initialIsMobile);
    const [mounted, setMounted] = useState(false);

    // Set mounted state after component mounts
    useEffect(() => {
        setMounted(true);
        
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
        
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            
            // Only update states if there's a change in screen size category
            if (isMobile !== mobile) {
                setIsMobile(mobile);
                setSidebarOpen(!mobile);
            }
        };
        
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // For SSR environments, provide simple default layout until client-side code runs
    if (!isClient && !mounted) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <div className="fixed h-full w-64 bg-gray-900">
                    {/* Static sidebar placeholder */}
                </div>
                <main className="flex-1 ml-64">
                    <div><Outlet /></div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile menu button */}
            {isMobile && (
                <button 
                    onClick={toggleSidebar}
                    className="fixed z-40 top-4 left-4 p-2 rounded-md bg-gray-800 text-white md:hidden"
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}
            
            {/* Sidebar - use inline styles for initial render to prevent flash */}
            <aside 
                className={`fixed z-30 h-full w-64 bg-gray-900 text-white p-4 
                           transition-all duration-300 ease-in-out 
                           ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}
                style={{ 
                    transform: !mounted ? (initialIsMobile ? 'translateX(-100%)' : 'translateX(0)') : undefined 
                }}
            >
                {(!isMobile || !mounted) && (
                    <h2 className="text-xl font-bold mb-6">BudgetBuddy</h2>
                )}
                <nav className={`flex flex-col space-y-6 mt-8 ${isMobile ? 'pt-12' : 'pt-0'}`}>
                    <Link to="/dashboard" className="hover:text-blue-300 transition-colors">Dashboard</Link>
                    <Link to="/budget" className="hover:text-blue-300 transition-colors">Budget</Link>
                    <Link to="/finance" className="hover:text-blue-300 transition-colors">Finances</Link>
                    <Link to="/settings" className="hover:text-blue-300 transition-colors">Settings</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main 
                className={`flex-1 transition-all duration-300`}
                style={{ marginLeft: !mounted ? (initialIsMobile ? '0' : '16rem') : (isMobile ? '0' : '16rem') }}
            >
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default NavBar;