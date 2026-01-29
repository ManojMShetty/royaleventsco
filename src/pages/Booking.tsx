import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import {
  MapPin, Users, Calendar, Utensils, ArrowLeft, Check, CreditCard
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { dataStore } from '@/data/store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import VenueCalendar from '@/components/venue/VenueCalendar';
import type { Booking, BookingService } from '@/types';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const venueId = searchParams.get('venue');
  const hallId = searchParams.get('hall');
  const foodTypeParam = searchParams.get('foodType') as 'veg' | 'nonveg' | 'both' | null;
  const platesParam = searchParams.get('plates');

  const venue = venueId ? dataStore.getVenueById(venueId) : null;
  const hall = venue?.halls.find(h => h.id === hallId);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(parseInt(platesParam || '100'));
  const [foodType, setFoodType] = useState<'veg' | 'nonveg' | 'both'>(foodTypeParam || 'both');
  const [plates, setPlates] = useState(parseInt(platesParam || '100'));
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const services = dataStore.getVerifiedServices();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!venue || !hall) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold mb-2">Invalid booking</h2>
            <p className="text-muted-foreground mb-4">Please select a venue first.</p>
            <Button onClick={() => navigate('/venues')}>Browse Venues</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const numberOfDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 1;

  const foodPrice = venue.foodService
    ? plates * numberOfDays * (foodType === 'veg'
      ? venue.foodService.vegPricePerPlate
      : foodType === 'nonveg'
        ? venue.foodService.nonVegPricePerPlate
        : (venue.foodService.vegPricePerPlate + venue.foodService.nonVegPricePerPlate) / 2)
    : 0;

  const venuePrice = hall.pricePerDay * numberOfDays;
  
  const selectedServicesData = services.filter(s => selectedServices.includes(s.id));
  const servicesPrice = selectedServicesData.reduce((sum, s) => sum + s.priceRange.min, 0);
  
  const platformFee = (venuePrice + foodPrice + servicesPrice) * 0.05;
  const totalPrice = venuePrice + foodPrice + servicesPrice + platformFee;

  const handleDateSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleConfirmBooking = () => {
    if (!startDate) {
      toast({
        title: 'Select a date',
        description: 'Please select your event date(s).',
        variant: 'destructive',
      });
      return;
    }

    // Validate date availability
    if (!dataStore.areDatesAvailable(venue.id, startDate, endDate || startDate)) {
      toast({
        title: 'Dates unavailable',
        description: 'Some of the selected dates are no longer available.',
        variant: 'destructive',
      });
      return;
    }

    const bookingServices: BookingService[] = selectedServicesData.map(s => ({
      serviceId: s.id,
      serviceName: s.name,
      category: s.category,
      price: s.priceRange.min,
    }));

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      userId: user?.id || '',
      venueId: venue.id,
      venueName: venue.name,
      hallId: hall.id,
      hallName: hall.name,
      eventDate: startDate,
      eventEndDate: endDate || startDate,
      numberOfDays,
      guestCount,
      foodOption: venue.foodService ? {
        type: foodType,
        plates,
        pricePerPlate: foodType === 'veg' 
          ? venue.foodService.vegPricePerPlate 
          : foodType === 'nonveg' 
            ? venue.foodService.nonVegPricePerPlate 
            : (venue.foodService.vegPricePerPlate + venue.foodService.nonVegPricePerPlate) / 2,
      } : undefined,
      services: bookingServices,
      venuePrice,
      foodPrice,
      servicesPrice,
      platformFee,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
    };

    dataStore.addBooking(booking);
    navigate(`/booking-success?id=${booking.id}`);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to venue
            </button>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Complete Your Booking
            </h1>
            <p className="text-muted-foreground mt-2">
              {venue.name} • {hall.name}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    step >= s
                      ? "bg-gold text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                <span className={cn(
                  "hidden sm:block text-sm font-medium",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s === 1 ? 'Date & Guests' : s === 2 ? 'Services' : 'Confirm'}
                </span>
                {s < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Date & Guests */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Date Range Picker */}
                  <VenueCalendar
                    venueId={venue.id}
                    basePrice={hall.pricePerDay}
                    mode="range"
                    selectedStartDate={startDate}
                    selectedEndDate={endDate}
                    onDateSelect={handleDateSelect}
                  />

                  <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                    <h2 className="font-serif text-2xl font-semibold mb-6">
                      Guest & Food Details
                    </h2>

                    <div className="space-y-6">
                      {/* Guest Count */}
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          <Users className="w-4 h-4 inline mr-2 text-gold" />
                          Number of Guests
                        </Label>
                        <Input
                          type="number"
                          value={guestCount}
                          onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                          min={50}
                          max={hall.capacity}
                          className="h-12"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Maximum capacity: {hall.capacity} guests
                        </p>
                      </div>

                      {/* Food Options */}
                      {venue.foodService && (
                        <div className="bg-secondary rounded-xl p-6 border border-gold/20">
                          <div className="flex items-center gap-2 mb-4">
                            <Utensils className="w-5 h-5 text-gold" />
                            <h3 className="font-semibold text-lg">Royal Catering</h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm mb-2 block">Food Type</Label>
                              <div className="flex gap-2">
                                {['veg', 'nonveg', 'both'].map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => setFoodType(type as any)}
                                    className={cn(
                                      "px-4 py-2 rounded-full text-sm capitalize transition-all",
                                      foodType === type
                                        ? "bg-gold text-primary"
                                        : "bg-card border border-border text-muted-foreground hover:border-gold/50"
                                    )}
                                  >
                                    {type === 'nonveg' ? 'Non-Veg' : type === 'both' ? 'Both' : 'Veg'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm mb-2 block">Number of Plates (per day)</Label>
                              <Input
                                type="number"
                                value={plates}
                                onChange={(e) => setPlates(Math.max(venue.foodService?.minPlates || 50, parseInt(e.target.value) || 0))}
                                min={venue.foodService?.minPlates}
                                className="w-32"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Minimum: {venue.foodService.minPlates} plates
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-gradient-gold text-primary font-semibold"
                    disabled={!startDate}
                  >
                    Continue to Services
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Services */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                    <h2 className="font-serif text-2xl font-semibold mb-2">
                      Add Event Services
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Enhance your celebration with our premium services (optional)
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            selectedServices.includes(service.id)
                              ? "border-gold bg-secondary"
                              : "border-border hover:border-gold/50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs uppercase tracking-wider text-gold">
                                {service.category}
                              </span>
                              <h3 className="font-semibold mt-1">{service.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {service.experience} years experience
                              </p>
                            </div>
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                selectedServices.includes(service.id)
                                  ? "border-gold bg-gold"
                                  : "border-muted-foreground"
                              )}
                            >
                              {selectedServices.includes(service.id) && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </div>
                          <p className="font-serif text-gold font-semibold mt-2">
                            From ₹{(service.priceRange.min / 1000).toFixed(0)}K
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1 h-12 bg-gradient-gold text-primary font-semibold"
                    >
                      Review Booking
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 lg:p-8"
                >
                  <h2 className="font-serif text-2xl font-semibold mb-6">
                    Review Your Booking
                  </h2>

                  {/* Booking Summary */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-serif text-lg font-semibold">{venue.name}</h3>
                        <p className="text-muted-foreground">{hall.name}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <MapPin className="w-4 h-4 text-gold" />
                          <span>{venue.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="p-4 bg-secondary rounded-xl">
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-semibold mt-1">
                          {startDate ? format(startDate, 'PPP') : '-'}
                        </p>
                      </div>
                      <div className="p-4 bg-secondary rounded-xl">
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-semibold mt-1">
                          {endDate ? format(endDate, 'PPP') : (startDate ? format(startDate, 'PPP') : '-')}
                        </p>
                      </div>
                      <div className="p-4 bg-secondary rounded-xl">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold mt-1">{numberOfDays} day{numberOfDays > 1 ? 's' : ''}</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-xl">
                        <p className="text-muted-foreground">Guests</p>
                        <p className="font-semibold mt-1">{guestCount} people</p>
                      </div>
                    </div>

                    {selectedServicesData.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Selected Services</h4>
                        <div className="space-y-2">
                          {selectedServicesData.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {service.category}
                                </p>
                              </div>
                              <p className="font-semibold">
                                ₹{(service.priceRange.min / 1000).toFixed(0)}K
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmBooking}
                      className="flex-1 h-12 bg-gradient-gold text-primary font-semibold"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Confirm Booking
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cost Breakdown Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-elevated">
                <h3 className="font-serif text-xl font-semibold mb-6">Cost Breakdown</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {hall.name} × {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">
                      ₹{(venuePrice / 100000).toFixed(2)}L
                    </span>
                  </div>

                  {venue.foodService && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Food ({plates} plates × {numberOfDays} day{numberOfDays > 1 ? 's' : ''})
                        </span>
                        <span className="font-medium">₹{(foodPrice / 100000).toFixed(2)}L</span>
                      </div>
                    </>
                  )}

                  {servicesPrice > 0 && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Services</span>
                        <span className="font-medium">₹{(servicesPrice / 100000).toFixed(2)}L</span>
                      </div>
                    </>
                  )}

                  <div className="h-px bg-border" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                    <span>₹{(platformFee / 100000).toFixed(2)}L</span>
                  </div>

                  <div className="h-px bg-gold/30" />

                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-semibold">Total</span>
                    <span className="font-serif text-2xl font-bold text-gold">
                      ₹{(totalPrice / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>

                {numberOfDays > 1 && (
                  <div className="p-3 bg-secondary rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Multi-day booking:</strong> Venue rent is calculated as ₹{(hall.pricePerDay / 100000).toFixed(1)}L × {numberOfDays} days
                    </p>
                  </div>
                )}

                <Badge className="w-full justify-center bg-gold/20 text-gold border-gold/30">
                  {numberOfDays} Day{numberOfDays > 1 ? 's' : ''} Event
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
