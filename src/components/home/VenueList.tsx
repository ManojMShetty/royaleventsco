import VenueCard from "./VenueCard";

/* ✅ Types */
type Props = {
    city: string;
    guests: string;
    serviceType: string;
};

type Venue = {
    id: number;
    name: string;
    location: string;
    pricePerDay: number;
    image: string;
    foodAvailable: boolean;
};

/* ✅ Dummy venue data (later this will come from DB) */
const venues: Venue[] = [
    {
        id: 1,
        name: "Royal Palace Hall",
        location: "Hyderabad",
        pricePerDay: 5000,
        image: "https://source.unsplash.com/400x300/?wedding,hall",
        foodAvailable: true,
    },
    {
        id: 2,
        name: "Grand Celebration Center",
        location: "Bangalore",
        pricePerDay: 7500,
        image: "https://source.unsplash.com/400x300/?banquet",
        foodAvailable: false,
    },
    {
        id: 3,
        name: "Lake View Convention",
        location: "Hyderabad",
        pricePerDay: 6500,
        image: "https://source.unsplash.com/400x300/?event,hall",
        foodAvailable: true,
    },
];

/* ✅ Component */
const VenueList = ({ city, guests, serviceType }: Props) => {
    const handleBook = (venueId: number) => {
        alert(`Booking venue ID: ${venueId}`);
    };

    /* ✅ Filter logic (Booking.com style) */
    const filteredVenues = venues.filter((venue) => {
        if (city && venue.location !== city) return false;
        return true;
    });

    return (
        <div className="max-w-5xl mx-auto mt-6">
            {filteredVenues.length === 0 ? (
                <p className="text-center text-gray-500">
                    No venues found for selected filters.
                </p>
            ) : (
                filteredVenues.map((venue) => (
                    <VenueCard
                        key={venue.id}
                        venue={venue}
                        onBook={handleBook}
                    />
                ))
            )}
        </div>
    );
};

export default VenueList;
