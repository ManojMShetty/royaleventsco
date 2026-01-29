import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Menu, X, User, LogOut, LayoutDashboard, Shield, BarChart3, Calendar, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/verification', label: 'Vendor Verification', icon: Shield },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/settings', label: 'Platform Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Crown className="w-8 h-8 text-gold" />
            </motion.div>
            <span className="font-serif text-xl lg:text-2xl font-semibold text-primary">
              Royal<span className="text-gold">Events</span>
            </span>
            <span className="hidden lg:inline-block text-xs bg-wine/20 text-wine px-2 py-1 rounded-full font-medium ml-2">
              Admin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive(item.path)
                    ? 'bg-secondary text-gold'
                    : 'text-foreground/80 hover:text-gold hover:bg-secondary/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <Shield className="w-4 h-4 text-wine" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
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
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive(item.path)
                      ? 'bg-secondary text-gold'
                      : 'text-foreground/80 hover:text-gold hover:bg-secondary/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              
              <div className="h-px bg-border my-2" />
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-destructive font-medium px-4 py-3"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;
