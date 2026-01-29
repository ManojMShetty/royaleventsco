import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, User, Phone, ArrowRight, Building, Palette, Music } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, VendorType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('user');
  const [vendorType, setVendorType] = useState<VendorType>('venue_owner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await register({
      email,
      password,
      name,
      role,
      vendorType: role === 'vendor' ? vendorType : undefined,
      phone,
    });

    if (success) {
      toast({
        title: 'Welcome to RoyalEvents!',
        description: 'Your account has been created successfully.',
      });
      
      // Role-based redirect after registration
      if (role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: 'Registration failed',
        description: 'This email is already registered. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const roles = [
    {
      value: 'user' as UserRole,
      title: 'Customer',
      description: 'Book venues and services for your events',
      icon: User,
    },
    {
      value: 'vendor' as UserRole,
      title: 'Vendor',
      description: 'List your venue or services on our platform',
      icon: Building,
    },
  ];

  const vendorTypes = [
    {
      value: 'venue_owner' as VendorType,
      title: 'Venue Owner',
      description: 'List your banquet halls, hotels, or event spaces',
      icon: Building,
    },
    {
      value: 'event_management' as VendorType,
      title: 'Event Management',
      description: 'Offer complete event planning packages',
      icon: Palette,
    },
    {
      value: 'artist' as VendorType,
      title: 'Independent Artist',
      description: 'Photography, DJ, makeup, mehndi, etc.',
      icon: Music,
    },
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

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Join RoyalEvents
              </h1>
              <p className="text-muted-foreground mb-8">
                Choose how you want to use our platform
              </p>

              <div className="space-y-4">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRole(r.value);
                      if (r.value === 'user') {
                        setStep(3);
                      } else {
                        setStep(2);
                      }
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-gold ${
                      role === r.value ? 'border-gold bg-secondary' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                        <r.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{r.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground hover:text-gold mb-4"
              >
                ← Back
              </button>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Select Vendor Type
              </h1>
              <p className="text-muted-foreground mb-8">
                What type of services do you offer?
              </p>

              <div className="space-y-4">
                {vendorTypes.map((vt) => (
                  <button
                    key={vt.value}
                    onClick={() => {
                      setVendorType(vt.value);
                      setStep(3);
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-gold ${
                      vendorType === vt.value ? 'border-gold bg-secondary' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                        <vt.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{vt.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {vt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setStep(role === 'vendor' ? 2 : 1)}
                className="text-sm text-muted-foreground hover:text-gold mb-4"
              >
                ← Back
              </button>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Create Account
              </h1>
              <p className="text-muted-foreground mb-8">
                Fill in your details to get started
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>

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
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-12 bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-secondary border-border"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-gold text-primary font-semibold hover:opacity-90"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </motion.div>
          )}

          <p className="mt-6 text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-wine to-wine-dark" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <Crown className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold mb-4">
              Start Your Royal Journey
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              Join thousands of users who trust RoyalEvents for their special celebrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
