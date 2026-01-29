import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  CheckCircle, Calendar, MapPin, Users, Download, Home, Sparkles
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { dataStore } from '@/data/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Confetti from '@/components/effects/Confetti';

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const [showConfetti, setShowConfetti] = useState(true);

  const booking = bookingId ? dataStore.getBookingById(bookingId) : null;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold mb-2">Booking not found</h2>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showConfetti && <Confetti />}
      
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 bg-gold/20 rounded-full blur-xl"
              />
              <div className="relative bg-gradient-gold rounded-full p-6 inline-block">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  Your Royal Event Is Confirmed!
                </h1>
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <p className="text-muted-foreground text-lg">
                We're thrilled to be part of your special celebration
              </p>
            </motion.div>
          </motion.div>

          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl border border-gold/30 overflow-hidden shadow-elevated"
          >
            {/* Header */}
            <div className="bg-gradient-gold p-6 text-center">
              <p className="text-primary/70 text-sm">Booking Reference</p>
              <p className="font-mono text-2xl font-bold text-primary tracking-wider">
                #{booking.id.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Venue Info */}
              <div className="text-center pb-6 border-b border-border">
                <h2 className="font-serif text-2xl font-bold">{booking.venueName}</h2>
                <p className="text-muted-foreground">{booking.hallName}</p>
                <Badge className="badge-gold mt-2">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Pending Confirmation
                </Badge>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-semibold">
                    {format(new Date(booking.eventDate), 'PPP')}
                  </p>
                </div>
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-semibold">{booking.guestCount} people</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <MapPin className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-semibold">
                    {dataStore.getVenueById(booking.venueId || '')?.city || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Services */}
              {booking.services.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Selected Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {booking.services.map((service, i) => (
                      <Badge key={i} variant="secondary" className="capitalize px-3 py-1">
                        {service.category}: {service.serviceName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Gold Divider */}
              <div className="gold-divider" />

              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Venue ({booking.hallName})</span>
                  <span>₹{(booking.venuePrice / 100000).toFixed(2)}L</span>
                </div>
                {booking.foodPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Food Service ({booking.foodOption?.plates} plates)
                    </span>
                    <span>₹{(booking.foodPrice / 100000).toFixed(2)}L</span>
                  </div>
                )}
                {booking.servicesPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Event Services ({booking.services.length})
                    </span>
                    <span>₹{(booking.servicesPrice / 100000).toFixed(2)}L</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>₹{(booking.platformFee / 100000).toFixed(2)}L</span>
                </div>
                <div className="h-px bg-gold/30" />
                <div className="flex justify-between items-center">
                  <span className="font-serif text-xl font-semibold">Total Amount</span>
                  <span className="font-serif text-3xl font-bold text-gold">
                    ₹{(booking.totalPrice / 100000).toFixed(2)}L
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-secondary p-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground mb-4">
                A confirmation email has been sent to your registered email address.
                The venue will contact you shortly to finalize the details.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // Mock download
                    alert('Invoice download started!');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gradient-gold text-primary"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-muted-foreground text-sm mt-8"
          >
            Need help? Contact us at{' '}
            <a href="tel:+919876543210" className="text-gold hover:underline">
              +91 98765 43210
            </a>
          </motion.p>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccess;
