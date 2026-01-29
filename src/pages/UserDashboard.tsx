import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/data/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const bookings = dataStore.getBookingsByUser(user.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">
              Welcome, <span className="text-gold">{user.name}</span>
            </h1>
            <p className="text-primary-foreground/80">
              Manage your bookings and explore more venues
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: bookings.length, icon: Calendar },
              { label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed').length, icon: Clock },
              { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: CheckCircle },
              { label: 'Total Spent', value: `₹${(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / 100000).toFixed(1)}L`, icon: CreditCard },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bookings */}
          <div>
            <h2 className="font-serif text-2xl font-semibold mb-6">Your Bookings</h2>
            
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(booking.status)}
                            <span className="text-sm text-muted-foreground">
                              Booking #{booking.id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl font-semibold mb-1">
                            {booking.venueName}
                          </h3>
                          <p className="text-muted-foreground">{booking.hallName}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gold" />
                            <span>{new Date(booking.eventDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold" />
                            <span>{booking.guestCount} guests</span>
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      {booking.services.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-medium mb-2">Additional Services:</p>
                          <div className="flex flex-wrap gap-2">
                            {booking.services.map((service, i) => (
                              <Badge key={i} variant="secondary" className="capitalize">
                                {service.category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price */}
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Venue: ₹{(booking.venuePrice / 100000).toFixed(1)}L
                          {booking.foodPrice > 0 && ` • Food: ₹${(booking.foodPrice / 100000).toFixed(1)}L`}
                        </div>
                        <div className="font-serif text-xl font-bold text-gold">
                          ₹{(booking.totalPrice / 100000).toFixed(2)}L
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring venues for your next celebration
                </p>
                <Button onClick={() => window.location.href = '/venues'} className="bg-gradient-gold text-primary">
                  Explore Venues
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default UserDashboard;
