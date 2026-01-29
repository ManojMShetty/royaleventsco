import { useEffect, useState } from "react";
import axios from "axios";

type Booking = {
    _id: string;
    venueName: string;
    startDate: string;
    endDate: string;
    days: number;
    grandTotal: number;
    status: "pending" | "approved" | "cancelled";
};

const UserBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/bookings"
            );
            setBookings(res.data);
        } catch (error) {
            alert("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        const interval = setInterval(fetchBookings, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-center">
                Loading your bookings...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                My Bookings
            </h1>

            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div
                            key={b._id}
                            className="border rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {b.venueName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {new Date(b.startDate).toDateString()} →{" "}
                                    {new Date(b.endDate).toDateString()}
                                </p>
                                <p className="text-sm">
                                    Days: {b.days}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-green-600">
                                    ₹{b.grandTotal}
                                </p>

                                <span
                                    className={`inline-block mt-1 px-2 py-1 text-sm rounded text-white ${b.status === "pending"
                                        ? "bg-yellow-500"
                                        : b.status === "approved"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                        }`}
                                >
                                    {b.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;
