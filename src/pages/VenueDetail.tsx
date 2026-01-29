import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Users, Star, Utensils } from "lucide-react";

import { Venue } from "@/types";
import { dataStore } from "@/data/store";
import DateSelector from "@/components/user/DateSelector";
import BookingModal from "@/components/ui/BookingModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);

  // Booking state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [days, setDays] = useState(1);

  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const lunchPrice = 300;
  const dinnerPrice = 400;

  useEffect(() => {
    const found = dataStore.getVenues().find(v => v.id === id);
    if (!found) {
      navigate("/venues");
      return;
    }
    setVenue(found);
  }, [id, navigate]);

  if (!venue) return null;

  const venueTotal = venue.startingPrice * days;
  const foodTotal =
    (lunch ? lunchPrice * days : 0) +
    (dinner ? dinnerPrice * days : 0);

  const grandTotal = venueTotal + foodTotal;

  const handleDateChange = (start: Date, end: Date, totalDays: number) => {
    setStartDate(start);
    setEndDate(end);
    setDays(totalDays);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* HERO IMAGE */}
      <div className="relative h-[420px]">
        <img
          src={venue.images?.[0] || "/placeholder.svg"}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="font-serif text-4xl font-bold">{venue.name}</h1>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gold" />
              {venue.city}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gold" />
              Up to {venue.capacity}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-gold fill-gold" />
              {venue.rating}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
          {/* DESCRIPTION */}
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              About this venue
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {venue.description}
            </p>

            {venue.foodService && (
              <Badge className="mt-4 bg-gold text-primary">
                <Utensils className="w-3 h-3 mr-1" />
                Food Available
              </Badge>
            )}
          </div>

          {/* BIG CALENDAR */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Select your booking dates
            </h3>
            <DateSelector onDateChange={handleDateChange} />
          </div>

          {/* FOOD OPTIONS */}
          {venue.foodService && (
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-gold" />
                Catering Options
              </h3>

              <div className="flex gap-8 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lunch}
                    onChange={(e) => setLunch(e.target.checked)}
                  />
                  Lunch – ₹{lunchPrice}/day
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dinner}
                    onChange={(e) => setDinner(e.target.checked)}
                  />
                  Dinner – ₹{dinnerPrice}/day
                </label>
              </div>
            </div>
          )}

          {/* MAP */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Location</h3>
            <iframe
              title="map"
              className="w-full h-[300px] rounded-xl"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                venue.city
              )}&output=embed`}
            />
          </div>
        </div>

        {/* RIGHT COLUMN – STICKY BOOKING CARD */}
        <div className="sticky top-28 h-fit">
          <div className="bg-card border rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Booking Summary
            </h3>

            <div className="space-y-2 text-sm">
              <p>Venue: ₹{venueTotal}</p>
              <p>Food: ₹{foodTotal}</p>
              <hr />
              <p className="text-lg font-bold text-green-600">
                Total: ₹{grandTotal}
              </p>
            </div>

            <Button
              className="w-full mt-6 bg-gold text-primary text-lg"
              disabled={!startDate || !endDate}
              onClick={() => setShowModal(true)}
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && startDate && endDate && (
        <BookingModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => alert("Booking confirmed")}
          venueName={venue.name}
          startDate={startDate}
          endDate={endDate}
          days={days}
          venueTotal={venueTotal}
          foodTotal={foodTotal}
          grandTotal={grandTotal}
        />
      )}
    </div>
  );
};

export default VenueDetail;
