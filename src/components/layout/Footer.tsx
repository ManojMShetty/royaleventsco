import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Gold accent line */}
      <div className="h-1 bg-gradient-gold" />
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-gold" />
              <span className="font-serif text-2xl font-semibold">
                Royal<span className="text-gold">Events</span>
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Experience the royal way of booking your perfect celebration. 
              Venues, food, and event services — curated with elegance.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/venues" className="text-primary-foreground/80 hover:text-gold transition-colors text-sm">
                  Explore Venues
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-gold transition-colors text-sm">
                  Event Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-primary-foreground/80 hover:text-gold transition-colors text-sm">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">Services</h4>
            <ul className="space-y-2">
              <li className="text-primary-foreground/80 text-sm">Photography</li>
              <li className="text-primary-foreground/80 text-sm">Videography</li>
              <li className="text-primary-foreground/80 text-sm">Decoration</li>
              <li className="text-primary-foreground/80 text-sm">Catering</li>
              <li className="text-primary-foreground/80 text-sm">DJ & Music</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>123 Royal Avenue, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>hello@royalevents.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 RoyalEvents. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
