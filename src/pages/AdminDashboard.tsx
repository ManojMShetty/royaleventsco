import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

type Booking = {
  _id: string;
  grandTotal: number;
  status: "pending" | "approved" | "cancelled";
};

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect admin route
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/bookings"
        );
        setBookings(res.data);
      } catch (error) {
        alert("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  // 📊 Analytics (REAL)
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  const approvedBookings = bookings.filter(
    (b) => b.status === "approved"
  ).length;

  const cancelledBookings = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const totalRevenue = bookings
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + b.grandTotal, 0);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Bookings */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Total Bookings
            </p>
            <p className="text-3xl font-bold">
              {totalBookings}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pending
            </p>
            <p className="text-3xl font-bold text-yellow-500">
              {pendingBookings}
            </p>
          </div>

          {/* Approved */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Approved
            </p>
            <p className="text-3xl font-bold text-green-600">
              {approvedBookings}
            </p>
          </div>

          {/* Cancelled */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Cancelled
            </p>
            <p className="text-3xl font-bold text-red-600">
              {cancelledBookings}
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-emerald-600">
              ₹{totalRevenue}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
