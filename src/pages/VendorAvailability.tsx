import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building } from 'lucide-react';
import VendorLayout from '@/components/layout/VendorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/data/store';
import { Navigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VendorAvailabilityCalendar from '@/components/vendor/VendorAvailabilityCalendar';

const VendorAvailability: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isAuthenticated || user?.role !== 'vendor') {
    return <Navigate to="/login" replace />;
  }

  const myVenues = dataStore.getVenuesByVendor(user.id);
  const [selectedVenueId, setSelectedVenueId] = useState(myVenues[0]?.id || '');
  const selectedVenue = myVenues.find(v => v.id === selectedVenueId);

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <VendorLayout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-gold" />
              <h1 className="font-serif text-3xl lg:text-4xl font-bold">
                Availability <span className="text-gold">Management</span>
              </h1>
            </div>
            <p className="text-primary-foreground/80">
              Block dates, mark as unavailable, and manage your venue's calendar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {myVenues.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No venues yet</h3>
              <p className="text-muted-foreground">Add a venue first to manage its availability</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Venue Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Select Venue:</label>
                <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Choose a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {myVenues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name} - {venue.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              {selectedVenue && (
                <VendorAvailabilityCalendar
                  key={`${selectedVenueId}-${refreshKey}`}
                  venue={selectedVenue}
                  onUpdate={handleUpdate}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </VendorLayout>
  );
};

export default VendorAvailability;
