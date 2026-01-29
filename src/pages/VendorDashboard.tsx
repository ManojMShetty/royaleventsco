import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, Calendar, CreditCard, Plus, Star, Eye, Edit, Utensils, Package
} from 'lucide-react';
import VendorLayout from '@/components/layout/VendorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/data/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VenueForm from '@/components/vendor/VenueForm';

const VendorDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isAuthenticated || user?.role !== 'vendor') {
    return <Navigate to="/login" replace />;
  }

  const myVenues = dataStore.getVenuesByVendor(user.id);
  const myServices = dataStore.getServicesByVendor(user.id);
  const myBookings = myVenues.flatMap(v => dataStore.getBookingsByVenue(v.id));

  const totalEarnings = myBookings.reduce((sum, b) => sum + (b.venuePrice + b.foodPrice), 0);

  const stats = [
    { label: 'My Venues', value: myVenues.length, icon: Building },
    { label: 'Total Bookings', value: myBookings.length, icon: Calendar },
    { label: 'Total Earnings', value: `₹${(totalEarnings / 100000).toFixed(1)}L`, icon: CreditCard },
    { label: 'Avg Rating', value: myVenues.length > 0 ? (myVenues.reduce((sum, v) => sum + v.rating, 0) / myVenues.length).toFixed(1) : 'N/A', icon: Star },
  ];

  const handleAddVenue = () => {
    setShowAddVenue(true);
  };

  const handleVenueSuccess = () => {
    setShowAddVenue(false);
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
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">
                Vendor <span className="text-gold">Dashboard</span>
              </h1>
              <p className="text-primary-foreground/80">
                Manage your venues, bookings, and earnings
              </p>
            </div>
            <Button 
              onClick={handleAddVenue}
              className="bg-gradient-gold text-primary font-semibold gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Venue
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="venues">My Venues</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              {user.vendorType === 'artist' && (
                <TabsTrigger value="services">My Services</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">Recent Bookings</h3>
                  {myBookings.length > 0 ? (
                    <div className="space-y-3">
                      {myBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div>
                            <p className="font-medium">{booking.hallName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short'
                              })} • {booking.guestCount} guests
                              {booking.numberOfDays > 1 && ` • ${booking.numberOfDays} days`}
                            </p>
                          </div>
                          <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No bookings yet</p>
                  )}
                </div>

                {/* Venue Performance */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">Venue Performance</h3>
                  {myVenues.length > 0 ? (
                    <div className="space-y-4">
                      {myVenues.map((venue) => (
                        <div key={venue.id} className="p-4 bg-secondary rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{venue.name}</h4>
                            {venue.isVerified ? (
                              <Badge className="bg-green-100 text-green-700">Verified</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-gold fill-gold" />
                              {venue.rating}
                            </span>
                            <span>{venue.reviewCount} reviews</span>
                            <span>{venue.city}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-4">No venues added yet</p>
                      <Button onClick={handleAddVenue} variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Your First Venue
                      </Button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
                  <h3 className="font-serif text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => navigate('/vendor/availability')}
                    >
                      <Calendar className="w-6 h-6 text-gold" />
                      <span>Manage Availability</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                      onClick={handleAddVenue}
                    >
                      <Plus className="w-6 h-6 text-gold" />
                      <span>Add New Venue</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                    >
                      <CreditCard className="w-6 h-6 text-gold" />
                      <span>View Earnings</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                    >
                      <Star className="w-6 h-6 text-gold" />
                      <span>View Reviews</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="venues">
              <div className="space-y-4">
                {myVenues.length > 0 ? (
                  myVenues.map((venue) => (
                    <div key={venue.id} className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-64 h-48 lg:h-auto">
                          <img 
                            src={venue.images[0] || '/placeholder.svg'} 
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-serif text-xl font-semibold">{venue.name}</h3>
                                {venue.isVerified ? (
                                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending Verification</Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-2">{venue.city} • Capacity: {venue.capacity}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-gold fill-gold" />
                                  {venue.rating} ({venue.reviewCount} reviews)
                                </span>
                                <span>Starting ₹{(venue.startingPrice / 100000).toFixed(1)}L</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {venue.halls.map((hall) => (
                                  <Badge key={hall.id} variant="secondary">{hall.name}</Badge>
                                ))}
                                {venue.foodService && (
                                  <Badge className="bg-gold/20 text-gold border-gold/30">
                                    <Utensils className="w-3 h-3 mr-1" />
                                    Food Service
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="w-4 h-4" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-card rounded-xl border border-border">
                    <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">No venues yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first venue to start receiving bookings</p>
                    <Button onClick={handleAddVenue} className="bg-gradient-gold text-primary gap-2">
                      <Plus className="w-5 h-5" />
                      Add Venue
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="space-y-4">
                {myBookings.length > 0 ? (
                  myBookings.map((booking) => (
                    <div key={booking.id} className="bg-card rounded-xl border border-border p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }>
                              {booking.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              #{booking.id.slice(-6).toUpperCase()}
                            </span>
                            {booking.numberOfDays > 1 && (
                              <Badge variant="outline">{booking.numberOfDays} days</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg">{booking.hallName}</h3>
                          <p className="text-muted-foreground">
                            {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                            {booking.eventEndDate && booking.numberOfDays > 1 && (
                              <> - {new Date(booking.eventEndDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long'
                              })}</>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {booking.guestCount} guests
                            {booking.foodOption && ` • ${booking.foodOption.plates} plates (${booking.foodOption.type})`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-2xl font-bold text-gold">
                            ₹{((booking.venuePrice + booking.foodPrice) / 100000).toFixed(2)}L
                          </p>
                          <p className="text-sm text-muted-foreground">Your earnings</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-card rounded-xl border border-border">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">Bookings will appear here once customers start booking your venues</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {user.vendorType === 'artist' && (
              <TabsContent value="services">
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">Service Management</h3>
                  <p className="text-muted-foreground mb-4">Add and manage your services like photography, DJ, makeup, etc.</p>
                  <Button className="bg-gradient-gold text-primary gap-2">
                    <Plus className="w-5 h-5" />
                    Add Service
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      {/* Venue Form Modal */}
      <AnimatePresence>
        {showAddVenue && (
          <VenueForm
            onClose={() => setShowAddVenue(false)}
            onSuccess={handleVenueSuccess}
          />
        )}
      </AnimatePresence>
    </VendorLayout>
  );
};

export default VendorDashboard;
