import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      
      // Role-based redirect
      const storedUser = localStorage.getItem('royalUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'admin') {
          navigate('/admin');
        } else if (parsedUser.role === 'vendor') {
          navigate('/vendor');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const demoAccounts = [
    { role: 'Customer', email: 'customer@royal.com', password: 'password123' },
    { role: 'Vendor', email: 'venue@royal.com', password: 'password123' },
    { role: 'Admin', email: 'admin@royal.com', password: 'admin123' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <Crown className="w-8 h-8 text-gold" />
            <span className="font-serif text-2xl font-semibold text-primary">
              Royal<span className="text-gold">Events</span>
            </span>
          </Link>

          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-secondary border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-gold text-primary font-semibold hover:opacity-90"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:underline font-medium">
              Sign Up
            </Link>
          </p>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-3">Demo Accounts:</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  className="w-full flex items-center justify-between p-2 text-sm bg-background rounded hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{account.role}</span>
                  <span className="text-muted-foreground text-xs">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-wine to-wine-dark" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <Crown className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold mb-4">
              Your Royal Celebration Awaits
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              Access your bookings, manage your events, and explore premium venues and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
