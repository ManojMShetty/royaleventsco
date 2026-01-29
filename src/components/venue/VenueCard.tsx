import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Utensils, CheckCircle } from "lucide-react";

import { Venue } from "@/types";
import { Badge } from "@/components/ui/badge";
import DateSelector from "@/components/user/DateSelector";
import BookingModal from "@/components/ui/BookingModal";
import { supabase } from "@/lib/supabase";

interface VenueCardProps {
  venue: Venue;
  index?: number;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, index = 0 }) => {
  // Date & booking state
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Food
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const lunchPrice = 300;
  const dinnerPrice = 400;

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

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      alert("Please select dates first");
      return;
    }
    setShowModal(true);
  };

  // ✅ SUPABASE BOOKING SAVE
  const confirmBooking = async () => {
    if (!startDate || !endDate) return;

    try {
      setSaving(true);

      const { error } = await supabase.from("bookings").insert([
        {
          venue_id: venue.id,
          venue_name: venue.name,
          city: venue.city,

          start_date: startDate,
          end_date: endDate,
          days: days,

          venue_total: venueTotal,
          food_total: foodTotal,
          grand_total: grandTotal,

          food: {
            lunch,
            dinner,
          },

          status: "pending",
        },
      ]);

      if (error) {
        console.error("Supabase booking error:", error);
        alert("Failed to save booking");
        return;
      }

      setShowModal(false);
      alert("Booking confirmed 🎉");
    } catch (err) {
      console.error(err);
      alert("Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group royal-card overflow-hidden border border-border hover:border-gold/50 transition-all duration-300"
      >
        {/* IMAGE */}
        <div className="relative h-48 lg:h-56 overflow-hidden">
          <img
            src={venue.images?.[0] || "/placeholder.svg"}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex gap-2">
            {venue.isVerified && (
              <Badge className="bg-primary text-primary-foreground gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
            {venue.foodService && (
              <Badge className="bg-gold text-primary gap-1">
                <Utensils className="w-3 h-3" />
                Food Available
              </Badge>
            )}
          </div>

          {/* RATING */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-background/90 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-sm font-medium">{venue.rating}</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 lg:p-5">
          <h3 className="font-serif text-lg lg:text-xl font-semibold group-hover:text-gold">
            {venue.name}
          </h3>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gold" />
              {venue.city}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gold" />
              Up to {venue.capacity}
            </span>
          </div>

          {/* DATE SELECTOR */}
          <div className="mt-4">
            <DateSelector onDateChange={handleDateChange} />
          </div>

          {/* FOOD OPTIONS */}
          {venue.foodService && (
            <div className="mt-4 flex gap-6 text-sm">
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
          )}

          {/* PRICE + CTA */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm">Total</p>
              <p className="text-lg font-bold text-green-600">
                ₹{grandTotal}
              </p>
            </div>

            <button
              onClick={handleBookNow}
              className="bg-gold text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Book Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* BOOKING MODAL */}
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
          saving={saving}
        />
      )}
    </>
  );
};

export default VenueCard;
