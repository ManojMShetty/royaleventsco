// User roles
export type UserRole = 'user' | 'vendor' | 'admin';
export type VendorType = 'venue_owner' | 'event_management' | 'artist';

// User types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  vendorType?: VendorType;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

// Blocked date types for vendor availability management
export type BlockedDateStatus = 'booked' | 'unavailable' | 'blocked';

export interface BlockedDate {
  id: string;
  venueId: string;
  date: Date;
  status: BlockedDateStatus;
  note?: string;
  createdAt: Date;
}

// Venue types
export interface Hall {
  id: string;
  name: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
}

export interface FoodService {
  id: string;
  venueId: string;
  vegPricePerPlate: number;
  nonVegPricePerPlate: number;
  minPlates: number;
  menuItems: {
    veg: string[];
    nonVeg: string[];
  };
  isAvailable: boolean;
}

export interface Venue {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  city: string;
  address: string;
  images: string[];
  capacity: number;
  halls: Hall[];
  foodService?: FoodService;
  rating: number;
  reviewCount: number;
  amenities: string[];
  startingPrice: number;
  isVerified: boolean;
  createdAt: Date;
}

// Event Service types
export type ServiceCategory = 'photography' | 'videography' | 'dj' | 'makeup' | 'mehndi' | 'decorator' | 'planner';

export interface EventService {
  id: string;
  vendorId: string;
  name: string;
  category: ServiceCategory;
  description: string;
  city: string;
  priceRange: {
    min: number;
    max: number;
  };
  experience: number; // years
  portfolio: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: Date;
}

// Event Package (for event management companies)
export interface EventPackage {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  includedServices: ServiceCategory[];
  price: number;
  isVerified: boolean;
  createdAt: Date;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingService {
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  venueId?: string;
  venueName?: string;
  hallId?: string;
  hallName?: string;
  eventDate: Date;
  eventEndDate?: Date; // For multi-day bookings
  numberOfDays: number;
  guestCount: number;
  foodOption?: {
    type: 'veg' | 'nonveg' | 'both';
    plates: number;
    pricePerPlate: number;
  };
  services: BookingService[];
  venuePrice: number;
  foodPrice: number;
  servicesPrice: number;
  platformFee: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

// Auth context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  vendorType?: VendorType;
  phone?: string;
}

// Search/Filter types
export interface VenueFilters {
  city?: string;
  date?: Date;
  guests?: number;
  priceRange?: { min: number; max: number };
  hasFood?: boolean;
  amenities?: string[];
}

export interface ServiceFilters {
  city?: string;
  category?: ServiceCategory;
  priceRange?: { min: number; max: number };
}
