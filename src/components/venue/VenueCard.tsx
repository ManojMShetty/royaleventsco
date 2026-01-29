import { motion } from "framer-motion";
import { MapPin, Users, Star, Utensils, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Venue } from "@/types";
import { Badge } from "@/components/ui/badge";

interface VenueCardProps {
  venue: Venue;
  index?: number;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, index = 0 }) => {
  const navigate = useNavigate();
  navigate(`/venue/${venue.id}`);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => navigate(`/venue/${venue.id}`)}
      className="group cursor-pointer royal-card overflow-hidden border border-border hover:border-gold/50 transition-all duration-300"
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

        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Starting from</p>
          <p className="text-lg font-bold text-green-600">
            ₹{venue.startingPrice}/day
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard;
