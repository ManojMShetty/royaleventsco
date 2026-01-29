import { useEffect, useState } from "react";
import axios from "axios";

type Booking = {
    _id: string;
    venueName: string;
    startDate: string;
    endDate: string;
    days: number;
    venueTotal: number;
    foodTotal: number;
    grandTotal: number;
    status: "pending" | "approved" | "cancelled";
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchBookings = async () => {
        const res = await axios.get(
            "http://localhost:5000/api/bookings"
        );
        setBookings(res.data);
    };

    const updateStatus = async (
        id: string,
        status: "approved" | "cancelled"
    ) => {
        await axios.put(
            `http://localhost:5000/api/bookings/${id}/status`,
            { status }
        );

        setBookings((prev) =>
            prev.map((b) =>
                b._id === id ? { ...b, status } : b
            )
        );
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                Admin – Bookings
            </h1>

            <table className="w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Venue</th>
                        <th className="p-2 border">Dates</th>
                        <th className="p-2 border">Total</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {bookings.map((b) => (
                        <tr key={b._id} className="text-center">
                            <td className="p-2 border">{b.venueName}</td>
                            <td className="p-2 border">
                                {new Date(b.startDate).toDateString()} →
                                {new Date(b.endDate).toDateString()}
                            </td>
                            <td className="p-2 border font-semibold">
                                ₹{b.grandTotal}
                            </td>

                            {/* STATUS BADGE */}
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

                            {/* ACTIONS */}
                            <td className="p-2 border space-x-2">
                                {b.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                updateStatus(b._id, "approved")
                                            }
                                            className="bg-green-600 text-white px-2 py-1 rounded"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateStatus(b._id, "cancelled")
                                            }
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminBookings;
