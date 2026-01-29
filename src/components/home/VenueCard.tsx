import { useState } from "react";
import DateSelector from "@/components/user/DateSelector";
import BookingModal from "@/components/ui/BookingModal";

type Venue = {
    id: number;
    name: string;
    location: string;
    pricePerDay: number;
    image: string;
    foodAvailable: boolean;
};

type Props = {
    venue: Venue;
    onBook: (venueId: number) => void;
};

const VenueCard = ({ venue, onBook }: Props) => {
    const [days, setDays] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Food selection
    const [lunch, setLunch] = useState(false);
    const [dinner, setDinner] = useState(false);

    // Modal
    const [showModal, setShowModal] = useState(false);

    const lunchPrice = 300;
    const dinnerPrice = 400;

    const venueTotal = venue.pricePerDay * days;
    const foodTotal =
        (lunch ? lunchPrice * days : 0) +
        (dinner ? dinnerPrice * days : 0);

    const grandTotal = venueTotal + foodTotal;

    const handleDateChange = (
        start: Date,
        end: Date,
        totalDays: number
    ) => {
        setStartDate(start);
        setEndDate(end);
        setDays(totalDays);
    };

    const handleBooking = () => {
        if (!startDate || !endDate) {
            alert("Please select dates first");
            return;
        }
        setShowModal(true);
    };

    const confirmBooking = () => {
        setShowModal(false);

        // Later: save to DB here
        alert("Booking confirmed 🎉");

        onBook(venue.id);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">

                {/* TOP SECTION */}
                <div className="flex">
                    <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-64 h-48 object-cover"
                    />

                    <div className="flex-1 p-4">
                        <h2 className="text-xl font-semibold">{venue.name}</h2>
                        <p className="text-gray-600">{venue.location}</p>

                        <p className="mt-2 text-sm">
                            {venue.foodAvailable ? "🍽 Food Available" : "❌ No Food"}
                        </p>

                        <p className="mt-3 text-lg font-bold text-blue-600">
                            ₹{venue.pricePerDay} / day
                        </p>
                    </div>
                </div>

                {/* DATE SELECTOR */}
                <div className="p-4 border-t">
                    <DateSelector onDateChange={handleDateChange} />
                </div>

                {/* FOOD OPTIONS */}
                {venue.foodAvailable && (
                    <div className="p-4 border-t bg-gray-50">
                        <h3 className="font-semibold mb-2">Food Options</h3>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={lunch}
                                    onChange={(e) => setLunch(e.target.checked)}
                                />
                                Lunch (₹{lunchPrice}/day)
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={dinner}
                                    onChange={(e) => setDinner(e.target.checked)}
                                />
                                Dinner (₹{dinnerPrice}/day)
                            </label>
                        </div>
                    </div>
                )}

                {/* PRICE SUMMARY */}
                <div className="p-4 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        <p>Venue: ₹{venueTotal}</p>
                        <p>Food: ₹{foodTotal}</p>
                        <p className="font-bold text-lg text-green-600">
                            Total: ₹{grandTotal}
                        </p>
                    </div>

                    <button
                        onClick={handleBooking}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {/* BOOKING CONFIRMATION MODAL */}
            {showModal && startDate && endDate && (
                <BookingModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmBooking}
                    venueName={venue.name}
                    startDate={startDate}
                    endDate={endDate}
                    days={days}
                    venueTotal={venueTotal}
                    foodTotal={foodTotal}
                    grandTotal={grandTotal}
                />
            )}
        </>
    );
};

export default VenueCard;
