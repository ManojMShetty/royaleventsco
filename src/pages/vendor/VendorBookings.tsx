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

const VendorBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/bookings"
            );
            setBookings(res.data);
        } catch (error) {
            alert("Failed to load vendor bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-center">
                Loading vendor bookings...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                Vendor – Bookings
            </h1>

            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Venue</th>
                            <th className="p-2 border">Dates</th>
                            <th className="p-2 border">Days</th>
                            <th className="p-2 border">Total ₹</th>
                            <th className="p-2 border">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b._id} className="text-center">
                                <td className="p-2 border">
                                    {b.venueName}
                                </td>

                                <td className="p-2 border text-sm">
                                    {new Date(b.startDate).toDateString()}
                                    <br />→<br />
                                    {new Date(b.endDate).toDateString()}
                                </td>

                                <td className="p-2 border">{b.days}</td>

                                <td className="p-2 border font-semibold">
                                    ₹{b.grandTotal}
                                </td>

                                <td className="p-2 border">
                                    <span
                                        className={`px-2 py-1 rounded text-white text-sm ${b.status === "pending"
                                                ? "bg-yellow-500"
                                                : b.status === "approved"
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VendorBookings;
