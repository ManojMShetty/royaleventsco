import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Users, Star, Utensils, CheckCircle, Phone, Calendar,
  ChevronLeft, ChevronRight, Heart, Share2, Clock
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { dataStore } from '@/data/store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import VenueCalendar from '@/components/venue/VenueCalendar';
import { differenceInDays } from 'date-fns';

const VenueDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const venue = dataStore.getVenueById(id || '');
  const [selectedHall, setSelectedHall] = useState(venue?.halls[0]?.id || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [foodType, setFoodType] = useState<'veg' | 'nonveg' | 'both'>('both');
  const [plates, setPlates] = useState(100);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  if (!venue) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold mb-2">Venue not found</h2>
            <p className="text-muted-foreground mb-4">The venue you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/venues')}>Browse Venues</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedHallData = venue.halls.find(h => h.id === selectedHall);
  const numberOfDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 1;
  
  const foodPrice = venue.foodService 
    ? plates * numberOfDays * (foodType === 'veg' 
        ? venue.foodService.vegPricePerPlate 
        : foodType === 'nonveg' 
          ? venue.foodService.nonVegPricePerPlate 
          : (venue.foodService.vegPricePerPlate + venue.foodService.nonVegPricePerPlate) / 2)
    : 0;
  const venuePrice = (selectedHallData?.pricePerDay || 0) * numberOfDays;
  const platformFee = (venuePrice + foodPrice) * 0.05;
  const totalPrice = venuePrice + foodPrice + platformFee;

  const handleDateSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to make a booking.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!startDate) {
      toast({
        title: 'Select dates',
        description: 'Please select your event date(s) first.',
        variant: 'destructive',
      });
      return;
    }
    
    // Navigate to booking page with venue details
    const params = new URLSearchParams({
      venue: venue.id,
      hall: selectedHall,
      foodType: foodType,
      plates: plates.toString(),
    });
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Image Gallery */}
      <section className="relative h-[50vh] lg:h-[60vh] bg-muted overflow-hidden">
        <motion.img
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={venue.images[selectedImage] || '/placeholder.svg'}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Image navigation */}
        {venue.images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev - 1 + venue.images.length) % venue.images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/90 rounded-full hover:bg-background"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev + 1) % venue.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/90 rounded-full hover:bg-background"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {venue.isVerified && (
            <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1">
              <CheckCircle className="w-4 h-4" />
              Verified
            </Badge>
          )}
          {venue.foodService && (
            <Badge className="bg-gold text-primary gap-1 px-3 py-1">
              <Utensils className="w-4 h-4" />
              In-House Catering
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-background/90 rounded-full hover:bg-background">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-background/90 rounded-full hover:bg-background">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Image thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {venue.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedImage === index ? 'bg-gold w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-3">
                  {venue.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gold" />
                    {venue.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gold" />
                    Up to {venue.capacity} guests
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    {venue.rating} ({venue.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Gold Divider */}
              <div className="gold-divider" />

              {/* Description */}
              <div>
                <h2 className="font-serif text-xl font-semibold mb-3">About This Venue</h2>
                <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary rounded-full text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Calendar with Date Range Selection */}
              <VenueCalendar
                venueId={venue.id}
                basePrice={selectedHallData?.pricePerDay || venue.startingPrice}
                mode="range"
                selectedStartDate={startDate}
                selectedEndDate={endDate}
                onDateSelect={handleDateSelect}
              />

              {/* Halls */}
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Select a Hall</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venue.halls.map((hall) => (
                    <button
                      key={hall.id}
                      onClick={() => setSelectedHall(hall.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedHall === hall.id
                          ? 'border-gold bg-secondary'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-1">{hall.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Capacity: {hall.capacity} guests
                      </p>
                      <p className="font-serif text-gold font-semibold">
                        ₹{(hall.pricePerDay / 100000).toFixed(1)}L / day
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Service */}
              {venue.foodService && (
                <div className="bg-secondary rounded-2xl p-6 border border-gold/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-5 h-5 text-gold" />
                    <h2 className="font-serif text-xl font-semibold">In-House Royal Catering</h2>
                    <Badge className="badge-gold ml-2">Available</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-card p-4 rounded-xl border border-border">
                      <h4 className="font-medium text-green-600 mb-2">Vegetarian</h4>
                      <p className="font-serif text-2xl font-bold text-gold">
                        ₹{venue.foodService.vegPricePerPlate}
                      </p>
                      <p className="text-sm text-muted-foreground">per plate</p>
                    </div>
                    <div className="bg-card p-4 rounded-xl border border-border">
                      <h4 className="font-medium text-red-600 mb-2">Non-Vegetarian</h4>
                      <p className="font-serif text-2xl font-bold text-gold">
                        ₹{venue.foodService.nonVegPricePerPlate}
                      </p>
                      <p className="text-sm text-muted-foreground">per plate</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sample Menu</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-600 font-medium mb-1">Veg Items:</p>
                        <ul className="text-muted-foreground space-y-1">
                          {venue.foodService.menuItems.veg.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-red-600 font-medium mb-1">Non-Veg Items:</p>
                        <ul className="text-muted-foreground space-y-1">
                          {venue.foodService.menuItems.nonVeg.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-elevated">
                <h3 className="font-serif text-xl font-semibold mb-6">Cost Breakdown</h3>

                {/* Selected Dates Display */}
                {startDate && (
                  <div className="mb-4 p-3 bg-secondary rounded-lg">
                    <p className="text-sm font-medium mb-1">Selected Dates</p>
                    <p className="text-sm text-muted-foreground">
                      {startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {endDate && startDate.toDateString() !== endDate.toDateString() && (
                        <> - {endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
                      )}
                    </p>
                    <Badge className="mt-2 bg-gold/20 text-gold border-gold/30">
                      {numberOfDays} Day{numberOfDays > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {selectedHallData?.name || 'Select a hall'} × {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">
                      ₹{(venuePrice / 100000).toFixed(2)}L
                    </span>
                  </div>

                  {venue.foodService && (
                    <>
                      <div className="h-px bg-border" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Food Service</p>
                        <div className="flex gap-2 mb-2">
                          {['veg', 'nonveg', 'both'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setFoodType(type as any)}
                              className={`px-3 py-1 rounded-full text-sm capitalize ${
                                foodType === type
                                  ? 'bg-gold text-primary'
                                  : 'bg-secondary text-muted-foreground'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={plates}
                            onChange={(e) => setPlates(Math.max(venue.foodService?.minPlates || 50, parseInt(e.target.value) || 0))}
                            className="w-20 px-2 py-1 bg-secondary border border-border rounded text-center"
                            min={venue.foodService?.minPlates}
                          />
                          <span className="text-sm text-muted-foreground">plates/day</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Food ({plates} × {numberOfDays})</span>
                        <span className="font-medium">₹{(foodPrice / 100000).toFixed(2)}L</span>
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

                <Button
                  onClick={handleBooking}
                  className="w-full h-12 bg-gradient-gold text-primary font-semibold text-base"
                  disabled={!startDate}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {startDate ? 'Continue to Booking' : 'Select Dates First'}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Instant confirmation</span>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Need help?</p>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-2 text-gold hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VenueDetail;
