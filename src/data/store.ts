import { User, Venue, EventService, EventPackage, Booking, FoodService, BlockedDate, BlockedDateStatus } from '@/types';

// In-memory data store - DB ready architecture
class DataStore {
  private users: User[] = [];
  private venues: Venue[] = [];
  private eventServices: EventService[] = [];
  private eventPackages: EventPackage[] = [];
  private bookings: Booking[] = [];
  private blockedDates: BlockedDate[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock Users
    this.users = [
      {
        id: 'user-1',
        email: 'customer@royal.com',
        password: 'password123',
        name: 'Priya Sharma',
        role: 'user',
        phone: '+91 98765 43210',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'vendor-1',
        email: 'venue@royal.com',
        password: 'password123',
        name: 'Raj Palace Hotels',
        role: 'vendor',
        vendorType: 'venue_owner',
        phone: '+91 98765 11111',
        createdAt: new Date('2024-01-05'),
      },
      {
        id: 'vendor-2',
        email: 'events@royal.com',
        password: 'password123',
        name: 'Royal Events Co.',
        role: 'vendor',
        vendorType: 'event_management',
        phone: '+91 98765 22222',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: 'vendor-3',
        email: 'artist@royal.com',
        password: 'password123',
        name: 'Meera Photography',
        role: 'vendor',
        vendorType: 'artist',
        phone: '+91 98765 33333',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'admin-1',
        email: 'admin@royal.com',
        password: 'admin123',
        name: 'Platform Admin',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
      },
    ];

    // Mock Venues
    this.venues = [
      {
        id: 'venue-1',
        vendorId: 'vendor-1',
        name: 'The Grand Imperial Palace',
        description: 'A magnificent royal palace venue with stunning architecture, lush gardens, and world-class amenities. Perfect for grand celebrations and intimate gatherings alike.',
        city: 'Mumbai',
        address: '123 Royal Avenue, Bandra West, Mumbai 400050',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
          'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        capacity: 2000,
        halls: [
          { id: 'hall-1', name: 'The Royal Ballroom', capacity: 1000, pricePerDay: 500000, amenities: ['AC', 'Stage', 'Lighting'] },
          { id: 'hall-2', name: 'The Crystal Hall', capacity: 500, pricePerDay: 300000, amenities: ['AC', 'Stage', 'DJ Setup'] },
          { id: 'hall-3', name: 'Garden Pavilion', capacity: 800, pricePerDay: 400000, amenities: ['Open Air', 'Decor', 'Lighting'] },
        ],
        foodService: {
          id: 'food-1',
          venueId: 'venue-1',
          vegPricePerPlate: 1200,
          nonVegPricePerPlate: 1800,
          minPlates: 100,
          menuItems: {
            veg: ['Paneer Tikka', 'Dal Makhani', 'Biryani', 'Naan', 'Gulab Jamun'],
            nonVeg: ['Butter Chicken', 'Mutton Rogan Josh', 'Fish Tikka', 'Chicken Biryani'],
          },
          isAvailable: true,
        },
        rating: 4.8,
        reviewCount: 256,
        amenities: ['Valet Parking', 'AC', 'DJ', 'Decoration', 'Catering', 'Rooms'],
        startingPrice: 300000,
        isVerified: true,
        createdAt: new Date('2024-01-05'),
      },
      {
        id: 'venue-2',
        vendorId: 'vendor-1',
        name: 'Lakeside Heritage Resort',
        description: 'An enchanting lakeside venue with heritage architecture, offering breathtaking views and a serene atmosphere for your special day.',
        city: 'Udaipur',
        address: '456 Lake Palace Road, Udaipur 313001',
        images: [
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
        ],
        capacity: 1500,
        halls: [
          { id: 'hall-4', name: 'Lake View Terrace', capacity: 600, pricePerDay: 450000, amenities: ['Lake View', 'Open Air', 'Decor'] },
          { id: 'hall-5', name: 'Heritage Durbar', capacity: 400, pricePerDay: 350000, amenities: ['AC', 'Stage', 'Historic Decor'] },
        ],
        foodService: {
          id: 'food-2',
          venueId: 'venue-2',
          vegPricePerPlate: 1500,
          nonVegPricePerPlate: 2200,
          minPlates: 80,
          menuItems: {
            veg: ['Rajasthani Thali', 'Dal Baati', 'Churma', 'Ghewar'],
            nonVeg: ['Laal Maas', 'Safed Maas', 'Keema Baati'],
          },
          isAvailable: true,
        },
        rating: 4.9,
        reviewCount: 189,
        amenities: ['Valet Parking', 'Spa', 'Pool', 'Heritage Walk', 'Boat Ride'],
        startingPrice: 350000,
        isVerified: true,
        createdAt: new Date('2024-01-08'),
      },
      {
        id: 'venue-3',
        vendorId: 'vendor-1',
        name: 'The Golden Mahal',
        description: 'Opulent Mughal-inspired venue with intricate marble work, manicured gardens, and royal hospitality.',
        city: 'Delhi',
        address: '789 Heritage Lane, South Delhi 110001',
        images: [
          'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
        ],
        capacity: 2500,
        halls: [
          { id: 'hall-6', name: 'Sheesh Mahal', capacity: 1200, pricePerDay: 600000, amenities: ['AC', 'Mirror Work', 'Stage'] },
        ],
        rating: 4.7,
        reviewCount: 312,
        amenities: ['Parking', 'AC', 'Decoration', 'Bridal Suite'],
        startingPrice: 600000,
        isVerified: true,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: 'venue-4',
        vendorId: 'vendor-1',
        name: 'Seaside Grandeur',
        description: 'A stunning beachfront venue offering panoramic ocean views and sunset ceremonies.',
        city: 'Goa',
        address: '321 Beach Road, Candolim, Goa 403515',
        images: [
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
        ],
        capacity: 800,
        halls: [
          { id: 'hall-7', name: 'Beach Lawn', capacity: 400, pricePerDay: 350000, amenities: ['Beach View', 'Open Air'] },
          { id: 'hall-8', name: 'Ocean View Deck', capacity: 250, pricePerDay: 250000, amenities: ['Sunset View', 'Open Air'] },
        ],
        rating: 4.6,
        reviewCount: 145,
        amenities: ['Beach Access', 'Sunset Ceremony', 'Pool', 'Spa'],
        startingPrice: 250000,
        isVerified: false,
        createdAt: new Date('2024-01-12'),
      },
    ];

    // Mock Event Services
    this.eventServices = [
      {
        id: 'service-1',
        vendorId: 'vendor-3',
        name: 'Meera Photography Studio',
        category: 'photography',
        description: 'Award-winning wedding photography capturing your precious moments with artistic flair.',
        city: 'Mumbai',
        priceRange: { min: 150000, max: 500000 },
        experience: 8,
        portfolio: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
        ],
        rating: 4.9,
        reviewCount: 178,
        isVerified: true,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'service-2',
        vendorId: 'vendor-3',
        name: 'Royal Films',
        category: 'videography',
        description: 'Cinematic wedding films that tell your love story in the most beautiful way.',
        city: 'Mumbai',
        priceRange: { min: 200000, max: 800000 },
        experience: 10,
        portfolio: [],
        rating: 4.8,
        reviewCount: 134,
        isVerified: true,
        createdAt: new Date('2024-01-16'),
      },
      {
        id: 'service-3',
        vendorId: 'vendor-3',
        name: 'DJ Rhythm',
        category: 'dj',
        description: 'Electrifying DJ performances with the latest sound and lighting equipment.',
        city: 'Delhi',
        priceRange: { min: 50000, max: 150000 },
        experience: 6,
        portfolio: [],
        rating: 4.7,
        reviewCount: 89,
        isVerified: true,
        createdAt: new Date('2024-01-17'),
      },
      {
        id: 'service-4',
        vendorId: 'vendor-3',
        name: 'Glamour by Neha',
        category: 'makeup',
        description: 'Bridal makeup artistry that enhances your natural beauty for your special day.',
        city: 'Mumbai',
        priceRange: { min: 50000, max: 200000 },
        experience: 12,
        portfolio: [],
        rating: 4.9,
        reviewCount: 256,
        isVerified: true,
        createdAt: new Date('2024-01-18'),
      },
      {
        id: 'service-5',
        vendorId: 'vendor-3',
        name: 'Mehndi Magic',
        category: 'mehndi',
        description: 'Intricate traditional and contemporary mehndi designs by expert artists.',
        city: 'Udaipur',
        priceRange: { min: 15000, max: 50000 },
        experience: 15,
        portfolio: [],
        rating: 4.8,
        reviewCount: 312,
        isVerified: true,
        createdAt: new Date('2024-01-19'),
      },
      {
        id: 'service-6',
        vendorId: 'vendor-3',
        name: 'Dream Decor',
        category: 'decorator',
        description: 'Transform your venue into a magical wonderland with our expert decoration services.',
        city: 'Delhi',
        priceRange: { min: 200000, max: 1000000 },
        experience: 9,
        portfolio: [],
        rating: 4.7,
        reviewCount: 167,
        isVerified: false,
        createdAt: new Date('2024-01-20'),
      },
    ];

    // Mock Event Packages
    this.eventPackages = [
      {
        id: 'package-1',
        vendorId: 'vendor-2',
        name: 'Royal Grand Package',
        description: 'Complete wedding management including photography, videography, decoration, and DJ.',
        includedServices: ['photography', 'videography', 'decorator', 'dj'],
        price: 1500000,
        isVerified: true,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: 'package-2',
        vendorId: 'vendor-2',
        name: 'Elegant Essentials',
        description: 'Essential wedding services for a beautiful celebration.',
        includedServices: ['photography', 'decorator'],
        price: 800000,
        isVerified: true,
        createdAt: new Date('2024-01-11'),
      },
    ];

    // Mock Bookings
    this.bookings = [
      {
        id: 'booking-1',
        userId: 'user-1',
        venueId: 'venue-1',
        venueName: 'The Grand Imperial Palace',
        hallId: 'hall-1',
        hallName: 'The Royal Ballroom',
        eventDate: new Date('2024-03-15'),
        numberOfDays: 1,
        guestCount: 500,
        foodOption: {
          type: 'both',
          plates: 500,
          pricePerPlate: 1500,
        },
        services: [
          { serviceId: 'service-1', serviceName: 'Meera Photography Studio', category: 'photography', price: 250000 },
        ],
        venuePrice: 500000,
        foodPrice: 750000,
        servicesPrice: 250000,
        platformFee: 75000,
        totalPrice: 1575000,
        status: 'confirmed',
        createdAt: new Date('2024-02-01'),
      },
    ];

    // Mock blocked dates
    const today = new Date();
    this.blockedDates = [
      {
        id: 'blocked-1',
        venueId: 'venue-1',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        status: 'booked',
        note: 'Wedding ceremony',
        createdAt: new Date(),
      },
      {
        id: 'blocked-2',
        venueId: 'venue-1',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
        status: 'unavailable',
        note: 'Maintenance',
        createdAt: new Date(),
      },
      {
        id: 'blocked-3',
        venueId: 'venue-1',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
        status: 'blocked',
        note: 'Private event',
        createdAt: new Date(),
      },
    ];
  }

  // User methods
  getUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  // Venue methods
  getVenues(): Venue[] {
    return [...this.venues];
  }

  getVerifiedVenues(): Venue[] {
    return this.venues.filter(v => v.isVerified);
  }

  getVenueById(id: string): Venue | undefined {
    return this.venues.find(v => v.id === id);
  }

  getVenuesByVendor(vendorId: string): Venue[] {
    return this.venues.filter(v => v.vendorId === vendorId);
  }

  addVenue(venue: Venue): Venue {
    this.venues.push(venue);
    return venue;
  }

  updateVenue(id: string, updates: Partial<Venue>): Venue | undefined {
    const index = this.venues.findIndex(v => v.id === id);
    if (index !== -1) {
      this.venues[index] = { ...this.venues[index], ...updates };
      return this.venues[index];
    }
    return undefined;
  }

  // Blocked Dates methods
  getBlockedDates(): BlockedDate[] {
    return [...this.blockedDates];
  }

  getBlockedDatesByVenue(venueId: string): BlockedDate[] {
    return this.blockedDates.filter(bd => bd.venueId === venueId);
  }

  addBlockedDate(blockedDate: BlockedDate): BlockedDate {
    // Remove existing blocked date for same venue and date if exists
    this.blockedDates = this.blockedDates.filter(
      bd => !(bd.venueId === blockedDate.venueId && 
        bd.date.toDateString() === blockedDate.date.toDateString())
    );
    this.blockedDates.push(blockedDate);
    return blockedDate;
  }

  addBlockedDates(dates: Date[], venueId: string, status: BlockedDateStatus, note?: string): BlockedDate[] {
    const newBlockedDates: BlockedDate[] = dates.map(date => ({
      id: `blocked-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      venueId,
      date,
      status,
      note,
      createdAt: new Date(),
    }));

    // Remove existing blocked dates for same venue and dates
    const dateStrings = dates.map(d => d.toDateString());
    this.blockedDates = this.blockedDates.filter(
      bd => !(bd.venueId === venueId && dateStrings.includes(bd.date.toDateString()))
    );

    this.blockedDates.push(...newBlockedDates);
    return newBlockedDates;
  }

  removeBlockedDate(id: string): boolean {
    const index = this.blockedDates.findIndex(bd => bd.id === id);
    if (index !== -1) {
      this.blockedDates.splice(index, 1);
      return true;
    }
    return false;
  }

  removeBlockedDateByVenueAndDate(venueId: string, date: Date): boolean {
    const index = this.blockedDates.findIndex(
      bd => bd.venueId === venueId && bd.date.toDateString() === date.toDateString()
    );
    if (index !== -1) {
      this.blockedDates.splice(index, 1);
      return true;
    }
    return false;
  }

  isDateBlocked(venueId: string, date: Date): boolean {
    return this.blockedDates.some(
      bd => bd.venueId === venueId && bd.date.toDateString() === date.toDateString()
    );
  }

  areDatesAvailable(venueId: string, startDate: Date, endDate: Date): boolean {
    const current = new Date(startDate);
    while (current <= endDate) {
      if (this.isDateBlocked(venueId, current)) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  }

  // Event Service methods
  getEventServices(): EventService[] {
    return [...this.eventServices];
  }

  getVerifiedServices(): EventService[] {
    return this.eventServices.filter(s => s.isVerified);
  }

  getServiceById(id: string): EventService | undefined {
    return this.eventServices.find(s => s.id === id);
  }

  getServicesByVendor(vendorId: string): EventService[] {
    return this.eventServices.filter(s => s.vendorId === vendorId);
  }

  getServicesByCategory(category: string): EventService[] {
    return this.eventServices.filter(s => s.category === category);
  }

  addEventService(service: EventService): EventService {
    this.eventServices.push(service);
    return service;
  }

  updateEventService(id: string, updates: Partial<EventService>): EventService | undefined {
    const index = this.eventServices.findIndex(s => s.id === id);
    if (index !== -1) {
      this.eventServices[index] = { ...this.eventServices[index], ...updates };
      return this.eventServices[index];
    }
    return undefined;
  }

  // Event Package methods
  getEventPackages(): EventPackage[] {
    return [...this.eventPackages];
  }

  getPackagesByVendor(vendorId: string): EventPackage[] {
    return this.eventPackages.filter(p => p.vendorId === vendorId);
  }

  addEventPackage(pkg: EventPackage): EventPackage {
    this.eventPackages.push(pkg);
    return pkg;
  }

  // Booking methods
  getBookings(): Booking[] {
    return [...this.bookings];
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  getBookingsByUser(userId: string): Booking[] {
    return this.bookings.filter(b => b.userId === userId);
  }

  getBookingsByVenue(venueId: string): Booking[] {
    return this.bookings.filter(b => b.venueId === venueId);
  }

  addBooking(booking: Booking): Booking {
    this.bookings.push(booking);
    
    // Automatically block booked dates
    if (booking.venueId) {
      const startDate = new Date(booking.eventDate);
      const endDate = booking.eventEndDate ? new Date(booking.eventEndDate) : startDate;
      const dates: Date[] = [];
      const current = new Date(startDate);
      while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      this.addBlockedDates(dates, booking.venueId, 'booked', `Booking #${booking.id.slice(-6)}`);
    }
    
    return booking;
  }

  updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookings[index].status = status;
      return this.bookings[index];
    }
    return undefined;
  }

  // Analytics methods (for admin)
  getAnalytics() {
    return {
      totalUsers: this.users.filter(u => u.role === 'user').length,
      totalVendors: this.users.filter(u => u.role === 'vendor').length,
      totalVenues: this.venues.length,
      verifiedVenues: this.venues.filter(v => v.isVerified).length,
      totalServices: this.eventServices.length,
      verifiedServices: this.eventServices.filter(s => s.isVerified).length,
      totalBookings: this.bookings.length,
      confirmedBookings: this.bookings.filter(b => b.status === 'confirmed').length,
      totalRevenue: this.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      platformEarnings: this.bookings.reduce((sum, b) => sum + b.platformFee, 0),
    };
  }

  // Pending verification items
  getPendingVerifications() {
    return {
      venues: this.venues.filter(v => !v.isVerified),
      services: this.eventServices.filter(s => !s.isVerified),
    };
  }
}

// Singleton instance
export const dataStore = new DataStore();
