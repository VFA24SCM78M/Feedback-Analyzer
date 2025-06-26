import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AnalyzeFeedback from "./Pages/AnalyzeFeedback";
import UploadCSV from "./Pages/UploadCSV";
import ViewFeedback from "./Pages/ViewFeedback";

// Animated background component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
      
      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full mix-blend-screen filter blur-xl opacity-70 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${
              ['#00f5ff', '#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b'][i]
            } 0%, transparent 70%)`,
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${20 + Math.random() * 10}s`
          }}
        />
      ))}
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

// Enhanced navigation with glassmorphism
const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Analyze', color: 'cyan' },
    { path: '/upload', label: 'Upload CSV', color: 'green' },
    { path: '/view', label: 'View Feedback', color: 'purple' }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      cyan: isActive 
        ? 'text-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/25' 
        : 'text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10',
      green: isActive 
        ? 'text-green-400 bg-green-400/20 shadow-lg shadow-green-400/25' 
        : 'text-green-300 hover:text-green-400 hover:bg-green-400/10',
      purple: isActive 
        ? 'text-purple-400 bg-purple-400/20 shadow-lg shadow-purple-400/25' 
        : 'text-purple-300 hover:text-purple-400 hover:bg-purple-400/10'
    };
    return colors[color];
  };

  return (
    <nav className="relative z-50">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                UWorld FeedbackHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      px-8 py-4 rounded-2xl font-semibold text-lg
                      transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                      ${getColorClasses(item.color, isActive)}
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
                <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      px-6 py-4 rounded-2xl font-semibold text-lg
                      transition-all duration-300 transform hover:translate-x-2
                      ${getColorClasses(item.color, isActive)}
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        
        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <Navigation />
          
          <main className={`transition-all duration-1000 ${
            mounted 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <Routes>
              <Route path="/" element={<AnalyzeFeedback />} />
              <Route path="/upload" element={<UploadCSV />} />
              <Route path="/view" element={<ViewFeedback />} />
            </Routes>
          </main>
        </div>

        {/* Global styles */}
        <style jsx global>{`
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #00f5ff, #ff006e);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #ff006e, #8338ec);
          }

          /* Smooth animations */
          * {
            transition-property: transform, opacity, background-color, border-color, color, fill, stroke;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Page enter animations */
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Floating animation for orbs */
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
            }
            33% { 
              transform: translateY(-30px) rotate(120deg); 
            }
            66% { 
              transform: translateY(20px) rotate(240deg); 
            }
          }
          
          .animate-float {
            animation: float linear infinite;
          }

          /* Gradient text animation */
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientShift 3s ease infinite;
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;