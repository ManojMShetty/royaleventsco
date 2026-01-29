import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Clock, CheckCircle, Phone, ArrowLeft,
  Camera, Video, Music, Palette, Sparkles, PartyPopper
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { dataStore } from '@/data/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ServiceCategory } from '@/types';

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  photography: <Camera className="w-6 h-6" />,
  videography: <Video className="w-6 h-6" />,
  dj: <Music className="w-6 h-6" />,
  makeup: <Palette className="w-6 h-6" />,
  mehndi: <Sparkles className="w-6 h-6" />,
  decorator: <PartyPopper className="w-6 h-6" />,
  planner: <PartyPopper className="w-6 h-6" />,
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

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = dataStore.getServiceById(id || '');

  if (!service) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold mb-2">Service not found</h2>
            <p className="text-muted-foreground mb-4">The service you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/services')}>Browse Services</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="relative py-12 bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to services
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image / Icon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {service.portfolio.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {service.portfolio.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${service.name} portfolio ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-2xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-gold/10 rounded-2xl flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    {categoryIcons[service.category]}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge className="badge-gold">
                  {categoryIcons[service.category]}
                  <span className="ml-1">{categoryLabels[service.category]}</span>
                </Badge>
                {service.isVerified && (
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {service.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gold" />
                  {service.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gold" />
                  {service.experience} years experience
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  {service.rating} ({service.reviewCount} reviews)
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Pricing Card */}
              <div className="bg-card rounded-2xl border border-gold/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price Range</p>
                    <p className="font-serif text-2xl font-bold text-gold">
                      ₹{(service.priceRange.min / 1000).toFixed(0)}K - ₹{(service.priceRange.max / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/venues')}
                  className="w-full h-12 bg-gradient-gold text-primary font-semibold"
                >
                  Add to Booking
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>Contact for custom packages</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-semibold mb-8">What's Included</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getServiceFeatures(service.category).map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-secondary rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary via-primary/95 to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-ivory mb-4">
            Ready to Book {service.name}?
          </h2>
          <p className="text-ivory/80 mb-6">
            Add this service to your venue booking for a complete celebration package
          </p>
          <Button
            size="lg"
            className="bg-gold text-primary hover:bg-gold/90"
            onClick={() => navigate('/venues')}
          >
            Browse Venues First
          </Button>
        </div>
      </section>
    </Layout>
  );
};

function getServiceFeatures(category: ServiceCategory): string[] {
  const features: Record<ServiceCategory, string[]> = {
    photography: [
      'Pre-wedding photoshoot',
      'Wedding day coverage',
      'High-resolution edited photos',
      'Online gallery access',
      'Printed photo album',
      'Candid & posed shots',
    ],
    videography: [
      'Cinematic wedding film',
      'Pre-wedding video',
      'Same-day edit highlight',
      'Full ceremony recording',
      'Drone footage',
      '4K quality output',
    ],
    dj: [
      'Professional sound system',
      'LED lighting setup',
      'Wireless microphones',
      'Music customization',
      'MC services',
      'Dance floor lighting',
    ],
    makeup: [
      'Bridal makeup trial',
      'Wedding day makeup',
      'Hairstyling included',
      'Touch-up kit provided',
      'Family makeup available',
      'Premium products used',
    ],
    mehndi: [
      'Bridal hands & feet',
      'Custom design consultation',
      'Premium organic mehndi',
      'Extended guests service',
      'Traditional & modern styles',
      'After-care instructions',
    ],
    decorator: [
      'Venue transformation',
      'Floral arrangements',
      'Mandap decoration',
      'Table centerpieces',
      'Lighting design',
      'Theme customization',
    ],
    planner: [
      'Full event coordination',
      'Vendor management',
      'Timeline creation',
      'Budget management',
      'Day-of coordination',
      'Guest management',
    ],
  };
  return features[category] || [];
}

export default ServiceDetail;
