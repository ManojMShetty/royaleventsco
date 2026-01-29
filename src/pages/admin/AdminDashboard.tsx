import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

interface Booking {
    id: string;
    venue_name: string;
    city: string;
    start_date: string;
    end_date: string;
    days: number;
    grand_total: number;
    status: "pending" | "approved" | "cancelled";
}

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setBookings(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (
        id: string,
        status: "approved" | "cancelled"
    ) => {
        setUpdatingId(id);

        const { error } = await supabase
            .from("bookings")
            .update({ status })
            .eq("id", id);

        if (error) {
            alert("Failed to update booking");
        } else {
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status } : b))
            );
        }

        setUpdatingId(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <section className="bg-primary text-primary-foreground py-6">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* LEFT */}
                    <div>
                        <h1 className="font-serif text-3xl font-bold">
                            Admin <span className="text-gold">Dashboard</span>
                        </h1>
                        <p className="text-primary-foreground/80">
                            Manage all venue bookings
                        </p>
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="container mx-auto px-4 py-10">
                {loading ? (
                    <p className="text-muted-foreground">Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-6">
                        <p className="text-muted-foreground">No bookings found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <div
                                key={b.id}
                                className="bg-card border border-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                            >
                                {/* LEFT */}
                                <div>
                                    <h3 className="font-serif text-lg font-semibold">
                                        {b.venue_name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {b.city} • {b.days} day(s)
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {b.start_date} → {b.end_date}
                                    </p>
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                                    <p className="font-semibold text-green-600">
                                        ₹{b.grand_total}
                                    </p>

                                    <Badge
                                        className={
                                            b.status === "pending"
                                                ? "bg-yellow-500/10 text-yellow-600"
                                                : b.status === "approved"
                                                    ? "bg-green-500/10 text-green-600"
                                                    : "bg-red-500/10 text-red-600"
                                        }
                                    >
                                        {b.status}
                                    </Badge>

                                    {b.status === "pending" && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                disabled={updatingId === b.id}
                                                onClick={() => updateStatus(b.id, "approved")}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                disabled={updatingId === b.id}
                                                variant="destructive"
                                                onClick={() => updateStatus(b.id, "cancelled")}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
