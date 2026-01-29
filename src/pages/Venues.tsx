import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import VenueCard from '@/components/venue/VenueCard';
import { dataStore } from '@/data/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const Venues: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [hasFood, setHasFood] = useState(false);
  const [priceRange, setPriceRange] = useState('all');

  const allVenues = dataStore.getVerifiedVenues();
  const cities = [...new Set(allVenues.map(v => v.city))];

  // Filter venues
  const filteredVenues = allVenues.filter(venue => {
    if (city && venue.city !== city) return false;
    if (guests && venue.capacity < parseInt(guests)) return false;
    if (hasFood && !venue.foodService) return false;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (venue.startingPrice < min * 100000 || venue.startingPrice > max * 100000) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setCity('');
    setGuests('');
    setHasFood(false);
    setPriceRange('all');
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
              Find Your Perfect <span className="text-gold">Venue</span>
            </h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              Explore our curated collection of premium venues for your royal celebration
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gold hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="h-px bg-border" />

                {/* City */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    City
                  </label>
                  <Select value={city || "all"} onValueChange={(val) => setCity(val === "all" ? "" : val)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cities</SelectItem>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guest Count */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold" />
                    Minimum Capacity
                  </label>
                  <Input
                    type="number"
                    placeholder="Number of guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All prices</SelectItem>
                      <SelectItem value="0-3">Under ₹3L</SelectItem>
                      <SelectItem value="3-5">₹3L - ₹5L</SelectItem>
                      <SelectItem value="5-10">₹5L - ₹10L</SelectItem>
                      <SelectItem value="10-100">Above ₹10L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Food Available */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hasFood"
                    checked={hasFood}
                    onCheckedChange={(checked) => setHasFood(checked as boolean)}
                  />
                  <label htmlFor="hasFood" className="text-sm font-medium cursor-pointer">
                    Food service available
                  </label>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="flex-1 gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Venues Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredVenues.length}</span> venues found
                </p>
              </div>

              {filteredVenues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVenues.map((venue, index) => (
                    <VenueCard key={venue.id} venue={venue} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">No venues found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find more venues
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Same filter controls as desktop */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  City
                </label>
              <Select value={city || "all"} onValueChange={(val) => setCity(val === "all" ? "" : val)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cities</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  Minimum Capacity
                </label>
                <Input
                  type="number"
                  placeholder="Number of guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All prices</SelectItem>
                    <SelectItem value="0-3">Under ₹3L</SelectItem>
                    <SelectItem value="3-5">₹3L - ₹5L</SelectItem>
                    <SelectItem value="5-10">₹5L - ₹10L</SelectItem>
                    <SelectItem value="10-100">Above ₹10L</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasFoodMobile"
                  checked={hasFood}
                  onCheckedChange={(checked) => setHasFood(checked as boolean)}
                />
                <label htmlFor="hasFoodMobile" className="text-sm font-medium cursor-pointer">
                  Food service available
                </label>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Clear
              </Button>
              <Button onClick={() => setShowFilters(false)} className="flex-1 bg-gradient-gold text-primary">
                Apply
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Venues;
