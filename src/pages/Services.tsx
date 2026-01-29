import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera, Video, Music, Palette, Sparkles, PartyPopper, Search, Star, MapPin
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { dataStore } from '@/data/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ServiceCategory } from '@/types';
import { useNavigate } from 'react-router-dom';

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  photography: <Camera className="w-5 h-5" />,
  videography: <Video className="w-5 h-5" />,
  dj: <Music className="w-5 h-5" />,
  makeup: <Palette className="w-5 h-5" />,
  mehndi: <Sparkles className="w-5 h-5" />,
  decorator: <PartyPopper className="w-5 h-5" />,
  planner: <PartyPopper className="w-5 h-5" />,
};

const categoryLabels: Record<ServiceCategory, string> = {
  photography: 'Photography',
  videography: 'Videography',
  dj: 'DJ & Music',
  makeup: 'Bridal Makeup',
  mehndi: 'Mehndi Artist',
  decorator: 'Decoration',
  planner: 'Event Planner',
};

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all');
  const [city, setCity] = useState('');

  const allServices = dataStore.getVerifiedServices();
  const cities = [...new Set(allServices.map(s => s.city))];

  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || service.category === category;
    const matchesCity = !city || service.city === city;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const categories: ServiceCategory[] = ['photography', 'videography', 'dj', 'makeup', 'mehndi', 'decorator', 'planner'];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-secondary via-background to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Premium Event Services
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Curated collection of the finest wedding professionals to make your celebration unforgettable
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 bg-card border-border"
                />
              </div>
              <Select value={city || "all"} onValueChange={(val) => setCity(val === "all" ? "" : val)}>
                <SelectTrigger className="w-full sm:w-48 h-12 bg-card border-border">
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
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCategory('all')}
              className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                category === 'all'
                  ? 'bg-gradient-gold text-primary'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                  category === cat
                    ? 'bg-gradient-gold text-primary'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {categoryIcons[cat]}
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 text-gold/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-gold/50 transition-all hover:shadow-elevated"
                >
                  {/* Image / Icon Header */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center">
                    {service.portfolio.length > 0 ? (
                      <img
                        src={service.portfolio[0]}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-gold/60">
                        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center">
                          {categoryIcons[service.category]}
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <Badge className="absolute top-4 left-4 badge-gold">
                      {categoryIcons[service.category]}
                      <span className="ml-1">{categoryLabels[service.category]}</span>
                    </Badge>

                    {/* Verified Badge */}
                    {service.isVerified && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gold" />
                        {service.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        {service.rating} ({service.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {service.experience} years exp.
                      </Badge>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="font-serif text-xl font-bold text-gold">
                          ₹{(service.priceRange.min / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/service/${service.id}`)}
                        className="bg-gradient-gold text-primary hover:opacity-90"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-ivory mb-4">
            Are You a Wedding Professional?
          </h2>
          <p className="text-ivory/80 mb-8 max-w-xl mx-auto">
            Join our platform and connect with couples looking for premium services like yours
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-gold text-gold hover:bg-gold hover:text-primary"
            onClick={() => navigate('/register')}
          >
            Join as a Vendor
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
