import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VenueList from "@/components/home/VenueList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HeroSearch: React.FC = () => {
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('');
  const [serviceType, setServiceType] = useState('venue');
  const [searchClicked, setSearchClicked] = useState(false);

  const cities = ['Mumbai', 'Delhi', 'Udaipur', 'Goa', 'Jaipur', 'Bangalore'];

  return (
    <>
      {/* SEARCH BOX */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-background/95 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-elevated border border-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                City
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full h-12 bg-secondary border-border">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                Guests
              </label>
              <Input
                type="number"
                placeholder="Number of guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="h-12 bg-secondary border-border"
              />
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                Looking for
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="w-full h-12 bg-secondary border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venue">Venue Only</SelectItem>
                  <SelectItem value="venue-food">Venue + Food</SelectItem>
                  <SelectItem value="services">Event Services</SelectItem>
                  <SelectItem value="all">Complete Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={() => setSearchClicked(true)}
                className="w-full h-12 bg-gradient-gold text-primary font-semibold text-base hover:opacity-90 transition-opacity"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore
              </Button>
            </div>

          </div>
        </div>
      </motion.div>

      {/* VENUE RESULTS */}
      {searchClicked && (
        <div className="mt-10">
          <VenueList
            city={city}
            guests={guests}
            serviceType={serviceType}
          />
        </div>
      )}
    </>
  );
};

export default HeroSearch;
