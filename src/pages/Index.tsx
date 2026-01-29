import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Star, Shield, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/home/HeroSearch';
import VenueCard from '@/components/venue/VenueCard';
import { dataStore } from '@/data/store';
import heroImage from '@/assets/hero-venue.jpg';

const Index: React.FC = () => {
  const venues = dataStore.getVerifiedVenues().slice(0, 4);
  const services = dataStore.getVerifiedServices().slice(0, 6);

  const features = [
    {
      icon: Shield,
      title: 'Verified Vendors',
      description: 'Every venue and service provider is thoroughly vetted for quality and reliability.',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Curated selection of the finest venues and services for your royal celebration.',
    },
    {
      icon: Heart,
      title: 'Personalized Service',
      description: 'Dedicated support to help you plan every detail of your perfect event.',
    },
  ];

  const serviceCategories = [
    { name: 'Photography', count: 45, icon: '📸' },
    { name: 'Videography', count: 32, icon: '🎬' },
    { name: 'Decoration', count: 28, icon: '🎨' },
    { name: 'DJ & Music', count: 24, icon: '🎵' },
    { name: 'Makeup', count: 56, icon: '💄' },
    { name: 'Mehndi', count: 38, icon: '🌿' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Royal venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine-dark/90 via-wine/70 to-wine-dark/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto mb-10 lg:mb-14">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <Crown className="w-8 h-8 text-gold animate-glow-pulse" />
              <span className="text-gold font-medium tracking-widest uppercase text-sm">
                Royal Experience Awaits
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            >
              A Royal Way to Book Your{' '}
              <span className="text-gold">Perfect Celebration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto"
            >
              Venues, food, and event services — curated with elegance for your most cherished moments.
            </motion.p>
          </div>

          {/* Search Bar */}
          <HeroSearch />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 lg:mt-16 flex flex-wrap justify-center gap-8 lg:gap-16"
          >
            {[
              { value: '500+', label: 'Premium Venues' },
              { value: '200+', label: 'Trusted Vendors' },
              { value: '10K+', label: 'Happy Celebrations' },
              { value: '50+', label: 'Cities Covered' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-serif text-3xl lg:text-4xl font-bold text-gold">
                  {stat.value}
                </p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-gold">RoyalEvents</span>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-card rounded-2xl border border-border hover:border-gold/30 transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Featured <span className="text-gold">Venues</span>
              </h2>
              <p className="text-muted-foreground">
                Handpicked venues for your royal celebration
              </p>
            </div>
            <Link
              to="/venues"
              className="hidden sm:block text-gold font-medium hover:underline underline-offset-4"
            >
              View All Venues →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {venues.map((venue, index) => (
              <VenueCard key={venue.id} venue={venue} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/venues"
              className="text-gold font-medium hover:underline underline-offset-4"
            >
              View All Venues →
            </Link>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-gold/20 rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
              Event <span className="text-gold">Services</span>
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              Complete your celebration with our premium service providers
            </p>
            <div className="w-24 h-0.5 bg-gradient-gold mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/services?category=${category.name.toLowerCase()}`}
                  className="block p-6 bg-wine-light/30 border border-gold/20 rounded-xl text-center hover:border-gold/50 hover:bg-wine-light/50 transition-all"
                >
                  <span className="text-3xl mb-3 block">{category.icon}</span>
                  <h3 className="font-medium text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-primary-foreground/60">
                    {category.count} vendors
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-5 h-5" />
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-wine to-wine-dark rounded-3xl overflow-hidden p-8 lg:p-16">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 max-w-2xl">
              <Crown className="w-12 h-12 text-gold mb-6" />
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">
                Are You a Vendor?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join RoyalEvents and showcase your venue or services to thousands of couples 
                planning their dream celebrations. Grow your business with us.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
