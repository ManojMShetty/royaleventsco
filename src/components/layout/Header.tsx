import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'vendor':
        return '/vendor';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Crown className="w-8 h-8 text-gold" />
            </motion.div>
            <span className="font-serif text-xl lg:text-2xl font-semibold text-primary">
              Royal<span className="text-gold">Events</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/venues" 
              className="text-foreground/80 hover:text-gold transition-colors font-medium"
            >
              Venues
            </Link>
            <Link 
              to="/services" 
              className="text-foreground/80 hover:text-gold transition-colors font-medium"
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-foreground/80 hover:text-gold transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                  <User className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-gold text-primary font-semibold hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                to="/venues" 
                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Venues
              </Link>
              <Link 
                to="/services" 
                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="h-px bg-border my-2" />
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()}
                    className="flex items-center gap-2 text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-destructive font-medium py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-gold text-primary font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
