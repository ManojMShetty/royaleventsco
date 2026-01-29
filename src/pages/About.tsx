import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Heart, Star, Users, Award, Calendar, Quote } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Arjun Kapoor',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'With 15 years in luxury hospitality, Arjun founded RoyalEvents to revolutionize wedding planning in India.',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'Priya ensures every event runs flawlessly, bringing her expertise from managing 500+ grand celebrations.',
  },
  {
    name: 'Rahul Mehta',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Award-winning designer who transforms venues into breathtaking experiences that tell unique love stories.',
  },
  {
    name: 'Ananya Patel',
    role: 'Client Relations',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Ananya is the heart of our client experience, ensuring every couple feels like royalty throughout their journey.',
  },
];

const testimonials = [
  {
    name: 'Vikram & Neha Singh',
    event: 'Wedding at The Grand Palace',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
    rating: 5,
    text: 'RoyalEvents made our dream wedding a reality. From the stunning venue to the impeccable service, every detail was perfect. Our guests are still talking about it!',
  },
  {
    name: 'Amit & Riya Verma',
    event: 'Engagement at Lakeside Manor',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop',
    rating: 5,
    text: 'The team went above and beyond to accommodate our last-minute changes. The decoration was breathtaking and the food was absolutely divine.',
  },
  {
    name: 'Sanjay Malhotra',
    event: 'Corporate Gala',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    text: 'We hosted our annual gala through RoyalEvents and it was our most successful event yet. Professional, elegant, and truly royal treatment.',
  },
];

const stats = [
  { icon: Calendar, value: '2,500+', label: 'Events Hosted' },
  { icon: Users, value: '50,000+', label: 'Happy Guests' },
  { icon: Award, value: '15+', label: 'Industry Awards' },
  { icon: Heart, value: '98%', label: 'Client Satisfaction' },
];

const About: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <Crown className="w-16 h-16 text-gold" />
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-primary mb-6">
              Our <span className="text-gold">Royal</span> Story
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Where dreams meet elegance, and every celebration becomes a timeless memory.
              Welcome to RoyalEvents — India's premier destination for extraordinary events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop"
                  alt="Royal Events celebration"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-gold p-6 rounded-xl shadow-lg">
                  <p className="font-serif text-3xl font-bold text-primary">Since 2010</p>
                  <p className="text-primary/80 text-sm">Crafting Royal Moments</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary">
                A Legacy of <span className="text-gold">Excellence</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                RoyalEvents was born from a simple yet powerful vision: to transform every celebration 
                into an unforgettable royal experience. Founded in 2010 by Arjun Kapoor, our journey 
                began with a single wedding and a commitment to excellence that has never wavered.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we are proud to be one of India's most trusted event management companies, 
                having orchestrated over 2,500 spectacular events across the country. From intimate 
                ceremonies to grand celebrations, we bring the same passion and attention to detail 
                to every occasion.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our philosophy is simple: treat every client like royalty, and every event like a 
                masterpiece. With our curated network of premium venues, world-class vendors, and 
                a dedicated team of event specialists, we turn your vision into reality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 text-gold mx-auto mb-4" />
                <p className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary mb-4">
              Meet Our <span className="text-gold">Royal Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate professionals behind every magical moment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-gold/20">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4 mx-auto w-32 h-32">
                      <div className="absolute inset-0 bg-gradient-gold rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
                      <Avatar className="w-32 h-32 border-4 border-gold/30">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="text-2xl font-serif">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-primary mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gold font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary mb-4">
              Words from Our <span className="text-gold">Royal Clients</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from the families and couples who trusted us with their special moments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-gold/20">
                  <CardContent className="p-6">
                    <Quote className="w-10 h-10 text-gold/30 mb-4" />
                    <p className="text-foreground leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-gold/30">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-primary rounded-3xl p-8 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-gold" />
            <div className="absolute top-10 left-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-gold/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <Crown className="w-12 h-12 text-gold mx-auto mb-6" />
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Create Your Royal Moment?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Let us transform your vision into an extraordinary celebration. 
                Get in touch with our team today.
              </p>
              <a
                href="/venues"
                className="inline-block bg-gradient-gold text-primary font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Explore Venues
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
