import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

/* ===== PUBLIC PAGES ===== */
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import About from "./pages/About";

/* ===== USER ===== */
import UserDashboard from "./pages/UserDashboard";
import UserBookings from "./pages/user/UserBookings";

/* ===== VENDOR ===== */
import VendorDashboard from "./pages/VendorDashboard";
import VendorAvailability from "./pages/VendorAvailability";
import VendorBookings from "./pages/vendor/VendorBookings";

/* ===== ADMIN ===== */
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";

/* ===== MISC ===== */
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venue/:id" element={<VenueDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />

            {/* ===== USER ROUTES ===== */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-bookings" element={<UserBookings />} />

            {/* ===== VENDOR ROUTES ===== */}
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/venues" element={<VendorDashboard />} />
            <Route path="/vendor/availability" element={<VendorAvailability />} />
            <Route path="/vendor/bookings" element={<VendorBookings />} />
            <Route path="/vendor/earnings" element={<VendorDashboard />} />

            {/* ===== ADMIN ROUTES ===== */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/verification" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />

            {/* ===== 404 ===== */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
